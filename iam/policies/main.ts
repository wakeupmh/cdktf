// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { provider, iamPolicy, iamRole, lambdaFunction } from "@cdktf/provider-aws";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new provider.AwsProvider(this, "AWS", {
      region: "us-west-1",
    });

    const lambdaPolicy = iamPolicy.IamPolicy(this, "lambdaPolicy", {
      name: "my-policy",
      policy: JSON.stringify({
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

    const lambdaRole = new iamRole.IamRole(this, "lambdaRole", {
      name: "lambdaRole",
      assumeRolePolicy: lambdaPolicy.arn,
    });

    new lambdaFunction.LambdaFunction(this, "some-lambda", {
      functionName: "some-lambda",
      role: lambdaRole.arn,
      handler: "index.handler",
      runtime: "nodejs14.x",
      filename: "lambda.zip",
      memorySize: 128,
    });
    
  }
}

const app = new App();
new MyStack(app, "policies");
app.synth();
