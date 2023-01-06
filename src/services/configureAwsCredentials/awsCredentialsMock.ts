import { IAwsCredentials } from "../../types/aws";

const awsCredentialsMock = ({
  accessKeyId,
  secretAccessKey,
  region,
  bucket,
}: IAwsCredentials) => {
  const awsCredentialsMock = `const awsCredentials = {
  credentials: {
    accessKeyId: "${accessKeyId}",
    secretAccessKey: "${secretAccessKey}",
  },
  region: "${region}",
  bucket: "${bucket}",
};

export { awsCredentials };`;

  return awsCredentialsMock;
};

export { awsCredentialsMock };
