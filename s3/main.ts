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
      lifecycleRule: [{
        enabled: true,
        transition: [
          {
            days: 30,
            storageClass: "GLACIER_IR"
          },
          {
            days: 60,
            storageClass: "GLACIER"
          },
          {
            days: 90,
            storageClass: "DEEP_ARCHIVE"
          }
        ],
      }]
    });
    
  }
}

const app = new App();
new S3Stack(app, "s3");
app.synth();
