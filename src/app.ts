import { configureAwsCredentials } from "./services/configureAwsCredentials";
import { upload } from "./services/upload";

const app = async () => {
  await configureAwsCredentials();
  await upload();
};

export { app };
