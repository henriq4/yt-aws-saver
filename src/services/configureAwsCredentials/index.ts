import fs from "fs";
import path from "path";

import { dir } from "../../utils/dir";
import { awsCredentialsMock } from "./awsCredentialsMock";
import { getAwsCredentials } from "./getAwsCredentials";

const configureAwsCredentials = async () => {
  return new Promise<void>((resolve, _) => {
    const awsConfigFile = path.resolve(dir.configDir, "./aws/index.ts");

    fs.readFile(awsConfigFile, "utf-8", (error, data) => {
      if (error) return console.log(error);

      const isExampleText = data.match(/(example)/g) ? true : false;

      if (!isExampleText) {
        console.log("Credenciais aws configuradas...");

        return resolve();
      }

      getAwsCredentials()
        .then(({ accessKeyId, secretAccessKey, region, bucket }) =>
          awsCredentialsMock({
            accessKeyId,
            secretAccessKey,
            region,
            bucket,
          }),
        )
        .then((awsCredentialsMock: string) => {
          fs.writeFileSync(awsConfigFile, awsCredentialsMock);
        })
        .finally(() => resolve())
        .catch(error => console.log(error));
    });
  });
};

export { configureAwsCredentials };
