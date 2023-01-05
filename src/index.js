import { PassThrough } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import ytdl from "ytdl-core";

const passThrough = new PassThrough();

const url = "https://www.youtube.com/watch?v=1J6Ks4GE9cg";

async function test() {
  let info = await ytdl.getInfo(url);

  const download = ytdl(url, {
    quality: "highest",
  }).pipe(passThrough);

  try {
    const parallelUploads3 = new Upload({
      client: new S3Client({
        region: process.env.AWS_DEFAULT_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }),
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${info.videoDetails.title.split(" ").join("_")}.mkv`,
        Body: download,
      },
    });

    parallelUploads3.on("httpUploadProgress", progress => {
      console.log(progress);
    });

    await parallelUploads3.done();
  } catch (e) {
    console.log(e);
  }
}

test();
