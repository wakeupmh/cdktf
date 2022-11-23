import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { provider, s3Bucket} from "@cdktf/provider-aws"

class S3Stack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new provider.AwsProvider(this, "AWS", {
      region: "us-west-1",
    });
    
    new s3Bucket.S3Bucket(this, "my-first-bkt", {
      bucket: "my-first-bkt",
      acl: "private",
    });
    
  }
}

const app = new App();
new S3Stack(app, "s3");
app.synth();
