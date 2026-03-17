import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

type EcsStackProps = cdk.StackProps & {
  vpc: ec2.Vpc;
  frontendRepository: ecr.Repository;
  backendRepository: ecr.Repository;
  dbSecret: secretsmanager.ISecret;
  dbEndpoint: string;
  dbName: string;
};

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    const {
      vpc,
      frontendRepository,
      backendRepository,
      dbSecret,
      dbEndpoint,
      dbName,
    } = props;

    /**
     * ECS クラスター: ECS タスクを実行するための論理グループ。
     * Fargate を使うことでサーバーの管理が不要になる。
     */
    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
      clusterName: "todo-app-cluster",
    });

    // ─── バックエンドタスク定義 ────────────────────────────────

    /**
     * タスク定義: コンテナの仕様（CPU・メモリ・イメージ・環境変数など）を定義する。
     * Fargate 互換のタスク定義を使用する。
     */
    const backendTaskDef = new ecs.FargateTaskDefinition(
      this,
      "BackendTaskDef",
      {
        cpu: 256,    // 0.25 vCPU
        memoryLimitMiB: 512,
      }
    );

    // Secrets Manager から DB 認証情報を読み取る権限を付与する
    dbSecret.grantRead(backendTaskDef.taskRole);

    const backendContainer = backendTaskDef.addContainer("BackendContainer", {
      // ECR から最新イメージを取得する
      image: ecs.ContainerImage.fromEcrRepository(backendRepository, "latest"),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "backend" }),
      environment: {
        DATABASE_HOST: dbEndpoint,
        DATABASE_PORT: "3306",
        DATABASE_NAME: dbName,
        PORT: "3000",
      },
      // Secrets Manager から DB ユーザー名・パスワードを取得して環境変数に注入する
      secrets: {
        DATABASE_USER: ecs.Secret.fromSecretsManager(dbSecret, "username"),
        DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, "password"),
      },
    });
    backendContainer.addPortMappings({ containerPort: 3000 });

    // ─── フロントエンドタスク定義 ─────────────────────────────

    const frontendTaskDef = new ecs.FargateTaskDefinition(
      this,
      "FrontendTaskDef",
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    const frontendContainer = frontendTaskDef.addContainer(
      "FrontendContainer",
      {
        image: ecs.ContainerImage.fromEcrRepository(
          frontendRepository,
          "latest"
        ),
        logging: ecs.LogDrivers.awsLogs({ streamPrefix: "frontend" }),
      }
    );
    frontendContainer.addPortMappings({ containerPort: 80 });

    // ─── セキュリティグループ ─────────────────────────────────

    const albSecurityGroup = new ec2.SecurityGroup(this, "AlbSecurityGroup", {
      vpc,
      description: "Security group for ALB (allow HTTP from internet)",
    });
    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP from internet"
    );

    const backendSecurityGroup = new ec2.SecurityGroup(
      this,
      "BackendSecurityGroup",
      {
        vpc,
        description: "Security group for backend ECS tasks",
      }
    );
    backendSecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(3000),
      "Allow from ALB"
    );

    const frontendSecurityGroup = new ec2.SecurityGroup(
      this,
      "FrontendSecurityGroup",
      {
        vpc,
        description: "Security group for frontend ECS tasks",
      }
    );
    frontendSecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(80),
      "Allow from ALB"
    );

    // ─── ALB（Application Load Balancer）────────────────────

    /**
     * ALB: インターネットからのリクエストを受け付け、
     * パスに応じてフロントエンド・バックエンドへ振り分ける。
     */
    const alb = new elbv2.ApplicationLoadBalancer(this, "Alb", {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
    });

    const listener = alb.addListener("HttpListener", { port: 80 });

    // ─── バックエンド ECS サービス ────────────────────────────

    const backendService = new ecs.FargateService(this, "BackendService", {
      cluster,
      taskDefinition: backendTaskDef,
      desiredCount: 1,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [backendSecurityGroup],
      assignPublicIp: false,
    });

    // ─── フロントエンド ECS サービス ──────────────────────────

    const frontendService = new ecs.FargateService(this, "FrontendService", {
      cluster,
      taskDefinition: frontendTaskDef,
      desiredCount: 1,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [frontendSecurityGroup],
      assignPublicIp: false,
    });

    // ─── ALB リスナールール（パスルーティング）────────────────

    /**
     * /api/* へのリクエストをバックエンドサービスへルーティングする。
     * priority が低い数値ほど先に評価される。
     */
    listener.addTargets("BackendTarget", {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [backendService],
      conditions: [
        elbv2.ListenerCondition.pathPatterns(["/api/*"]),
      ],
      priority: 10,
      healthCheck: {
        path: "/api/todos",
        healthyHttpCodes: "200",
      },
    });

    /**
     * それ以外のリクエスト（/* ）はフロントエンドサービスへルーティングする。
     */
    listener.addTargets("FrontendTarget", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [frontendService],
      healthCheck: {
        path: "/",
        healthyHttpCodes: "200",
      },
    });

    // ALB の DNS 名をコンソールで確認できるよう出力する
    new cdk.CfnOutput(this, "AlbDnsName", {
      value: alb.loadBalancerDnsName,
      description: "DNS name of the ALB (app access URL)",
    });
  }
}
