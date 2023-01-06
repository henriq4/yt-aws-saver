import { PassThrough } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import ytdl from "ytdl-core";

import { awsCredentials } from "../../config/aws";
import { client } from "../../providers/awsS3";

const upload = async () => {
  console.log("Começando o download...");

  const url = "https://www.youtube.com/watch?v=Yl-hlwhj2B0";
  const passThrough = new PassThrough();

  const info = await ytdl.getInfo(url);

  console.log("Informação carregada...");

  const download = ytdl(url, {
    quality: "highest",
  }).pipe(passThrough);

  const parallelUploads3 = new Upload({
    client,
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
};

export { upload };
