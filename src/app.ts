import { PassThrough } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import ytdl from "ytdl-core";

import { awsCredentials } from "./config/aws";

const passThrough = new PassThrough();

const url = "https://www.youtube.com/watch?v=Yl-hlwhj2B0";

const app = async () => {
  const info = await ytdl.getInfo(url);

  console.log("Informação carregada...");

  const download = ytdl(url, {
    quality: "highest",
  }).pipe(passThrough);

  try {
    const parallelUploads3 = new Upload({
      client: new S3Client({
        region: awsCredentials.region,
        credentials: awsCredentials.credentials,
      }),
      params: {
        Bucket: awsCredentials.bucket,
        Key: `${info.videoDetails.title.split(" ").join("_")}.mkv`,
        Body: download,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
    });

    await parallelUploads3.done();

    console.log("Download finalizado.");
  } catch (e) {
    console.log(e);
  }
};

export { app };
