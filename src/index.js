import {config} from "dotenv";
config();

import cp from "child_process";
import ytdl from "ytdl-core";
import ffmpeg from "ffmpeg-static";
import { question } from "readline-sync";
import { resolve } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const url = question("youtube url: ");

const tracker = {
  start: new Date(),
};

const filename = `${tracker.start.toISOString().split(".")[0]}.mkv`;

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const run = async () => {
  const originalPath = resolve("./", "tmp/", filename);
  const fileContent = await fs.promises.readFile(originalPath);

  const bucketParams = {
    Bucket: process.env.AWS_BUCKET,
    Key: filename,
    Body: fileContent,
  };

  try {
    await s3Client.send(new PutObjectCommand(bucketParams));

    await fs.promises.unlink(originalPath);
  } catch (err) {
    console.log("Error", err);
  }
};

// Get audio and video streams
const audio = ytdl(url, { quality: "highestaudio" });
const video = ytdl(url, { quality: "highestvideo" });

// Start the ffmpeg child process
const ffmpegProcess = cp.spawn(ffmpeg, [
  "-loglevel", "8", "-hide_banner",
  "-progress", "pipe:3",
  "-i", "pipe:4",
  "-i", "pipe:5",
  "-map", "0:a",
  "-map", "1:v",
  "-c:v", "copy",
  `tmp/${filename}`,
], {
  windowsHide: true,
  stdio: [
    /* stdin, stdout, stderr */
    "inherit", "inherit", "inherit",
    /* pipe:3, pipe:4, pipe:5 */
    "pipe", "pipe", "pipe",
  ],
});

ffmpegProcess.on("close", async () => {
  console.log("done\n");
  await run();
  console.log("\nsended\n");
});

// Link streams
ffmpegProcess.stdio[3].on("data", chunk => {
  const lines = chunk.toString().trim().split("\n");
  const args = {};

  for (const l of lines) {
    const [key, value] = l.split("=");
    args[key.trim()] = value.trim();
  }

  tracker.merged = args;
});

audio.pipe(ffmpegProcess.stdio[4]);
video.pipe(ffmpegProcess.stdio[5]);
