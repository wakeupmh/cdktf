import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import {
  provider,
  apigatewayv2Api,
  lambdaFunction,
  apigatewayv2Integration,
  apigatewayv2Stage,
  iamRole,
  apigatewayv2Route,
} from "@cdktf/provider-aws";

class ApiGatewayStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new provider.AwsProvider(this, "AWS", {
      region: "us-west-1",
    });

    const lambdaRole = new iamRole.IamRole(this, "lambdaRole", {
      name: "lambdaRole",
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Effect: "Allow",
            Sid: "",
          },
        ],
      }),
    });
    const lambda = new lambdaFunction.LambdaFunction(this, "my-first-lambda", {
      functionName: "my-first-lambda",
      role: lambdaRole.arn,
      handler: "index.handler",
      runtime: "nodejs14.x",
      filename: "lambda.zip",
      memorySize: 128,
    });

    const apiGatewayApi = new apigatewayv2Api.Apigatewayv2Api(
      this,
      "my-first-api",
      {
        name: "my-first-api",
        protocolType: "WEBSOCKET",
        routeSelectionExpression: "$request.body.action",
      }
    );

    const apiGatewayIntegration =
      new apigatewayv2Integration.Apigatewayv2Integration(
        this,
        "my-first-integration",
        {
          apiId: apiGatewayApi.id,
          integrationType: "AWS",
          integrationUri: lambda.invokeArn,
          credentialsArn: lambdaRole.arn,
          integrationMethod: "POST",
          requestParameters: {
            "integration.request.header.Content-Type": "'application/json'",
          },
          dependsOn: [lambdaRole, lambda],
        }
      );

    new apigatewayv2Stage.Apigatewayv2Stage(this, "my-first-stage", {
      apiId: apiGatewayApi.id,
      name: "$default",
      autoDeploy: true,
    });

    new apigatewayv2Route.Apigatewayv2Route(this, "my-first-route", {
      apiId: apiGatewayApi.id,
      routeKey: "$default",
      target: `integrations/${apiGatewayIntegration.id}`,
    });
  }
}

const app = new App();
new ApiGatewayStack(app, "apigateway");
app.synth();
