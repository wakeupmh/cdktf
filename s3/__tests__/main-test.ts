// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { s3Bucket } from "@cdktf/provider-aws";
import S3Stack from "../main";
describe("My CDKTF Application", () => {
  describe("Unit testing using assertions", () => {
    it("should contain a S3Bucket", () => {
      const synthScope =  Testing.synthScope((scope) => {
        new S3Stack(scope, "s3");
      })
      expect(
        synthScope
      ).toHaveResource(s3Bucket.S3Bucket);
    });
  });
});
