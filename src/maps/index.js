import {
  GetBucketLocationCommand,
  GetPublicAccessBlockCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";

export const S3 = {
  listBuckets: ListBucketsCommand,
  getBucketLocation: GetBucketLocationCommand,
  getPublicAccess: GetPublicAccessBlockCommand,
};
