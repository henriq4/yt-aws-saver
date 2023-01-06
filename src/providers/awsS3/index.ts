import { S3Client } from "@aws-sdk/client-s3";

import { awsCredentials } from "../../config/aws";

const client = new S3Client({
  region: awsCredentials.region,
  credentials: awsCredentials.credentials,
});

export { client };
