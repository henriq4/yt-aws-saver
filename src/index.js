import cp from "child_process";
import ytdl from "ytdl-core";
import ffmpeg from "ffmpeg-static";
import { question } from "readline-sync";

const url = question("youtube url: ");

const tracker = {
  start: new Date(),
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
  `tmp/${tracker.start.toISOString().split(".")[0]}.mkv`,
], {
  windowsHide: true,
  stdio: [
    /* stdin, stdout, stderr */
    "inherit", "inherit", "inherit",
    /* pipe:3, pipe:4, pipe:5 */
    "pipe", "pipe", "pipe",
  ],
});
ffmpegProcess.on("close", () => {
  console.log("done");
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
