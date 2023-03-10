import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const getAwsCredentials = async () => {
  const rl = readline.createInterface({
    input,
    output,
    terminal: false,
  });

  // alert message
  console.log("\nAws credentials are not seet, starting configuration...\n");

  const accessKeyId = await rl.question("Aws access key id: ");
  const secretAccessKey = await rl.question("Aws secret for access key: ");
  const region = await rl.question("Aws IAM account region: ");
  const bucket = await rl.question("Aws s3 bucket: ");

  rl.close();

  console.log("Saved aws credencials...\n");

  return {
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
  };
};

export { getAwsCredentials };
