const YAML = require('yaml'),
  CDP = require('chrome-remote-interface'),
  fs = require('fs'),
  exec = require('./util/exec'),
  timecode = require('./util/timecode');

// args are: nodejs index.js config.yaml
if (process.argv.length !== 3) {
  console.log("nodejs index.js config.yaml")
  process.exit(1)
}

// Load config
const config = YAML.parse(fs.readFileSync(process.argv[2], 'utf8')),
  tasks = config.modules;

console.log(JSON.stringify(config, 4))
//process.exit(1)

// Tally total number of frames for each module & setup start & end frame pointers
// for each one
let frameCount = 0
tasks.forEach(task => {
  // require the js module
  task.module = require(task.path);
  // Call the module to get it's config
  task.config = task.module(config, task);
  // If duration set then set frameCount
  if (task.duration) {
    task.frameCount = task.duration * config.video.frameRate;
  }
  // start & end frames
  task.startFrame = frameCount;
  frameCount += task.frameCount;
  task.endFrame = frameCount - 1;
})

timecode.init(config, frameCount);

console.log(
  "Generating", frameCount, "frames using",
  tasks.reduce(
    (a, task) => {
      a.push([task.name, '[', task.startFrame, ']'].join(""));
      return a
    }, [])
    .join(",")
)

// curTaskId index in tasks of current task
// curTask the current task
let curTaskId = -1, curTask;

console.log("Connecting to chromium")
CDP(async (client) => {
  console.log("Connected!");

  const {Network, Page, Runtime} = client;
  config.client = client;

  try {
    await Network.enable();
    await Page.enable();

    // Capture the browser logs on our console
    await Runtime.enable()
    await Runtime.consoleAPICalled((p) => {
      console.log(p);
    });

    await generateFrames(client);
    await generateAudio();
    await generateVideo();

    console.log(' Completed');
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}).on('error', (err) => {
  console.error(err);
});

async function generateFrames(client) {

  const {Emulation, Page, Runtime} = client;
  // Call the clock for each frame
  for (let frame = 0; frame < frameCount; frame++) {
    if (curTaskId === -1 || frame > curTask.endFrame) {
      curTaskId++;
      curTask = tasks[curTaskId];

      console.log("\rUsing", curTask.name, "for frames", frame, "to", curTask.endFrame);

      await Page.navigate({url: curTask.config.page});
      await Page.loadEventFired();

      const deviceMetrics = {
        width: config.video.width,
        height: config.video.height,
        deviceScaleFactor: 1,
        mobile: false,
        fitWindow: false,
      };
      await Emulation.setDeviceMetricsOverride(deviceMetrics);
      await Emulation.setVisibleSize({width: config.video.width, height: config.video.height});

      //await Runtime.consoleAPICalled((p) => {
      //  console.log(p);
      //});

      if (curTask.config.init) {
        const ex = curTask.config.init(frame - curTask.startFrame, frame, config, curTask);
        if (ex) {
          await Runtime.evaluate({
            expression: ex,
            awaitPromise: true
          });
        }
      }
    }

    process.stdout.write([
      "\rGenerating frame",
      "" + frame + "/" + frameCount,
      "eta", timecode.eta(config, frame, frameCount),
      "dur", timecode.duration(config, frame, frameCount),
    ].join(' '));

    if (curTask.config.updateFrame) {
      const ex = curTask.config.updateFrame(frame - curTask.startFrame, frame, config, curTask);
      if (ex) {
        await Runtime.evaluate({
          expression: ex,
          awaitPromise: true
        });
      }
    }

    {
      const ex = timecode.updateFrame(frame, config, curTask);
      if (ex) {
        await Runtime.evaluate({
          expression: ex,
          awaitPromise: true
        });
      }
    }

    const {data} = await Page.captureScreenshot();
    let out = "000000" + frame
    out = config.project.frames + "test-" + out.substr(-6, 6) + ".png";
    fs.writeFileSync(out, Buffer.from(data, 'base64'));
  }

}

async function generateAudio() {
  config.audioFiles = tasks.reduce((a, task) => {
    let b = [];
    if (task.config.createAudio) {
      console.log("tca")
      b = task.config.createAudio(config, task);
    }
    if (b && b.length) {
      a.push(...b)
    }
    return a
  }, [])

  if (config.audioFiles.length) {
    config.audioFile = config.project.frames + "audio.wav";

    const tmpfile = config.project.frames + "audio.txt"
    fs.writeFileSync(tmpfile,
      "file '" + config.audioFiles.join("'\nfile '") + "'\n",
      'utf-8'
    )
    exec([
      "ffmpeg", "-y",
      "-f", "concat",
      "-i", tmpfile,
      config.audioFile
    ])
  }
}

async function generateVideo() {
  if (config.project.output) {
    console.log("Generating", config.project.output)

    let cmd = ["ffmpeg", "-y"];

    cmd.push("-i", config.project.frames + "test-%06d.png");

    if (config.audioFile) {
      cmd.push("-i", config.audioFile)
    }

    // Frame rate & format
    cmd.push("-r", config.video.frameRate);
    // TODO are both -c:v or -vf needed?
    cmd.push("-c:v", "libx264");
    cmd.push("-vf", ["fps=", config.video.frameRate, ",format=yuv420p"].join(""));

    if (config.audioFile) {
      // Map file 0 as video, file 1 as audio0
      cmd.push("-map", "0:v:0")
      cmd.push("-map", "1:a:0")
    }

    // Finally the output file name
    cmd.push(config.project.output);

    exec(cmd);
  }
}
