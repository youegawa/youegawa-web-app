import * as cdk from "aws-cdk-lib";
import { VpcStack } from "../lib/vpc-stack";
import { EcrStack } from "../lib/ecr-stack";
import { DatabaseStack } from "../lib/database-stack";
import { EcsStack } from "../lib/ecs-stack";

const app = new cdk.App();

// デプロイ先のアカウントとリージョンを指定する
// AWS_ACCOUNT_ID 環境変数に自分の AWS アカウント ID を設定してください
const env: cdk.Environment = {
  account: process.env.AWS_ACCOUNT_ID ?? process.env.CDK_DEFAULT_ACCOUNT,
  region: "ap-northeast-1",
};

// ① VPC スタック: ネットワーク基盤を作成する
const vpcStack = new VpcStack(app, "VpcStack", { env });

// ② ECR スタック: Docker イメージ保存先のリポジトリを作成する
const ecrStack = new EcrStack(app, "EcrStack", { env });

// ③ Database スタック: RDS MySQL インスタンスを作成する（VPC が必要）
const databaseStack = new DatabaseStack(app, "DatabaseStack", {
  env,
  vpc: vpcStack.vpc,
});
databaseStack.addDependency(vpcStack);

// ④ ECS スタック: ECS Fargate + ALB でアプリを動かす（全スタックが必要）
const ecsStack = new EcsStack(app, "EcsStack", {
  env,
  vpc: vpcStack.vpc,
  frontendRepository: ecrStack.frontendRepository,
  backendRepository: ecrStack.backendRepository,
  dbSecret: databaseStack.dbSecret,
  dbEndpoint: databaseStack.dbEndpoint,
  dbName: databaseStack.dbName,
});
ecsStack.addDependency(vpcStack);
ecsStack.addDependency(ecrStack);
ecsStack.addDependency(databaseStack);
