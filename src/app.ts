import { configureAwsCredentials } from "./services/configureAwsCredentials";
import { upload } from "./services/upload";

const app = async () => {
  const url = process.argv[2];

  if (!url) {
    console.log("Url não fornecida, finalizando programa..");

    return 1;
  }

  await configureAwsCredentials();
  await upload(url);
};

export { app };
