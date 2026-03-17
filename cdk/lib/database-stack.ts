import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

type DatabaseStackProps = cdk.StackProps & {
  vpc: ec2.Vpc;
};

export class DatabaseStack extends cdk.Stack {
  // ECS スタックから参照できるようプロパティとして公開する
  public readonly dbSecret: secretsmanager.ISecret;
  public readonly dbEndpoint: string;
  public readonly dbName: string;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { vpc } = props;

    // データベース名を定数として定義する
    this.dbName = "appdb";

    /**
     * RDS に接続するための認証情報（ユーザー名・パスワード）を
     * Secrets Manager で自動生成・管理する。
     * - コンテナからは環境変数でこのシークレットの ARN を受け取り、SDK で読み込む
     */
    const dbSecret = new secretsmanager.Secret(this, "DbSecret", {
      secretName: "todo-app/db-credentials",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "appuser" }),
        generateStringKey: "password",
        excludePunctuation: true,
        includeSpace: false,
      },
    });
    this.dbSecret = dbSecret;

    /**
     * RDS 用のセキュリティグループ。
     * ECS タスクからのみ 3306 番ポートへのアクセスを許可する。
     * セキュリティグループのルールは後の EcsStack で追加する。
     */
    const dbSecurityGroup = new ec2.SecurityGroup(this, "DbSecurityGroup", {
      vpc,
      description: "Security group for RDS MySQL",
      allowAllOutbound: false,
    });

    /**
     * RDS MySQL 8.0 インスタンスを作成する。
     *
     * - instanceType: t3.micro … 학습用に最小コストのインスタンスを選択
     * - multiAz: false        … 학習用・コスト削減のためシングル AZ
     * - storageEncrypted: true … セキュリティベストプラクティスとしてストレージを暗号化
     * - deletionProtection: false … 학습用にスタック削除を容易にする
     * - removalPolicy: DESTROY   … スタック削除時に RDS も削除する（학習用設定）
     */
    const dbInstance = new rds.DatabaseInstance(this, "DbInstance", {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: this.dbName,
      storageEncrypted: true,
      multiAz: false,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 他スタックから参照できるようエンドポイントを公開する
    this.dbEndpoint = dbInstance.dbInstanceEndpointAddress;

    new cdk.CfnOutput(this, "DbEndpoint", {
      value: this.dbEndpoint,
      description: "RDS instance endpoint",
    });
    new cdk.CfnOutput(this, "DbSecretArn", {
      value: dbSecret.secretArn,
      description: "ARN of the DB credentials secret",
    });
  }
}
