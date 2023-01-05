import "dotenv";

import { app } from "./app";

try {
  app();
} catch (error) {
  console.log(error);
}
