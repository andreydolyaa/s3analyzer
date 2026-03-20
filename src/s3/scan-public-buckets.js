import {
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand,
  GetPublicAccessBlockCommand,
} from "@aws-sdk/client-s3";
import { S3 } from "../maps/index.js";

const clients = {};

function getClient(locationConstraint) {
  if (!clients[locationConstraint]) {
    clients[locationConstraint] = new S3Client({
      region: locationConstraint,
    });
  }
  return clients[locationConstraint];
}

async function call(command, existingClient) {
  const client = existingClient || new S3Client({});
  try {
    return await client.send(command);
  } catch (error) {
    console.error(`[s3analyzer] failed to call command: ${error}`);
  }
}

export async function scanPublicBuckets() {
  const { Buckets } = await call(new ListBucketsCommand());

  for (const bucket of Buckets) {
    const { LocationConstraint } = await call(
      new GetBucketLocationCommand({
        Bucket: bucket.Name,
      }),
    );

    const client = getClient(LocationConstraint) || "us-east-1";

    const { PublicAccessBlockConfiguration } = await call(
      new GetPublicAccessBlockCommand({
        Bucket: bucket.Name,
      }),
      client,
    );

    evaluatePublicBuckets(bucket.Name, PublicAccessBlockConfiguration)
  }
}

export function evaluatePublicBuckets(bucketName, data) {
  const issues = [];
  if (!data.BlockPublicAcls) issues.push(S3.msg.blockPublicAcls);
  if (!data.IgnorePublicAcls) issues.push(S3.msg.ignorePublicAcls);
  if (!data.BlockPublicPolicy) issues.push(S3.msg.blockPublicPolicy);
  if (!data.RestrictPublicBuckets) issues.push(S3.msg.restrictPublicBuckets);

  if (!issues.length) {
    console.log(`[OK] ${bucketName} - ${S3.msg.protected}`);
  } else {
    console.log(`[CRITICAL] ${bucketName} - ${S3.msg.notProtected}:`);
    issues.forEach((issue) => console.log(issue));
  }
}
