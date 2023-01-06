import { PassThrough } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import ytdl from "ytdl-core";

import { awsCredentials } from "../../config/aws";
import { client } from "../../providers/awsS3";

const upload = async (url: string) => {
  console.log("Carregando informações...");

  const passThrough = new PassThrough();

  const info = await ytdl.getInfo(url);

  console.log("Informações carregadas...");
  console.log("Começando o download...");

  const download = ytdl
    .downloadFromInfo(info, {
      quality: "highest",
    })
    .pipe(passThrough);

  const parallelUploads3 = new Upload({
    client,
    params: {
      Bucket: awsCredentials.bucket,
      Key: `${info.videoDetails.title.split(" ").join("_")}.mkv`,
      Body: download,
    },
    queueSize: 8, // 'workers'
    partSize: 1024 * 1024 * 5,
  });

  await parallelUploads3.done();

  console.log("Upload finalizado finalizado.");
};

export { upload };
