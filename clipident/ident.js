"use strict";

const svgCircleArc = require('../util/svg_circle_arc'),
  fs = require('fs'),
  exec = require('../util/exec');

const π = Math.PI;

const fixNumber = (v => (("00" + (v).toFixed(0))).substr(-2));

const secToAngle = ((sec) => 360 - (sec * 6));

function clockAngle(angle, minAngle, maxAngle) {
  return angle >= maxAngle ? maxAngle : angle <= minAngle ? minAngle : angle;
}

// Runs in the browser
function initClock(showFrames, title, project, type, author) {
  if (!showFrames) {
    const fc = document.getElementById("frameCounter");
    if (fc) {
      fc.setAttribute("style", "display:none");
    }
  }

  document.getElementById("title").textContent = title;
  document.getElementById("subTitle").textContent = project;
  document.getElementById("type").textContent = type;
  const e = document.getElementById("producer");
  author.forEach(a => {
    const d = document.createElement("div")
    d.appendChild(document.createTextNode(a))
    e.appendChild(d)
  });
}

// Runs in the browser
function updateClock(sec, f, handTransform, identStyle, redStyle, redTransform, greenStyle, greenTransform) {
  const
    clock = document.getElementById("clock"),
    clockDocument = clock.contentDocument,
    clockHand = clockDocument.getElementById("clockHand"),
    clockGreen = clockDocument.getElementById("clockGreen"),
    clockRed = clockDocument.getElementById("clockRed");

  clockHand.setAttribute("transform", handTransform)

  clockRed.setAttribute("style", redStyle);
  if (redTransform !== "") {
    clockRed.setAttribute("d", redTransform);
  }

  clockGreen.setAttribute("style", greenStyle);
  if (greenTransform !== "") {
    clockGreen.setAttribute("d", greenTransform);
  }

  document.getElementById("ident").setAttribute("style", identStyle);
  document.getElementById("seconds").textContent = sec;
  document.getElementById("frames").textContent = f;
}

// Called when this task starts
function init(frame, trueFrame, config, task) {
  return `(${initClock})(${!!task.showFrames},"${config.project.title}","${config.project.project}","${config.project.type}",["${config.project.author.join('","')}"])`;
}

// called for each frame
function updateFrame(frame, trueFrame, config, task) {

  // Seconds & frame in second
  // For countdown clocks we need Math.ceil() here.
  // If this was a count-up clock then Math.floor() would be used.
  const
    remainingFrames = task.endFrame - trueFrame,
    tsec = remainingFrames / config.video.frameRate,
    sec = Math.ceil(tsec),
    fsec = task.smoothArc ? tsec : sec,
    f = remainingFrames % config.video.frameRate,
    angle = secToAngle(sec),
    greenAngle = clockAngle(fsec, 10, 45),
    redAngle = clockAngle(fsec, 0, 10),
    hidden = "stroke:none;fill:none",
    handTransform = "rotate(" + [angle, task.config.cx, task.config.cy].join(" ") + ")",
    identStyle = sec <= 20 ? "" : "display:none",
    redShow = redAngle < 10,
    redStyle = redShow ? "stroke-width:5;stroke:red;fill:none" : hidden,
    redTransform = redShow ? svgCircleArc(
      [task.config.cx, task.config.cy],
      [task.config.cr, task.config.cr],
      [0, (6 * (10 - redAngle)) / 180 * π],
      210 / 180 * π
    ) : "",
    greenShow = greenAngle < 45,
    greenStyle = greenShow ? "stroke-width:5;stroke:#00ff00;fill:none" : hidden,
    greenTransform = greenShow ? svgCircleArc(
      [task.config.cx, task.config.cy],
      [task.config.cr, task.config.cr],
      [0, (6 * (45 - greenAngle)) / 180 * π],
      0
    ) : "";

  return `(${updateClock})("` + [
    fixNumber(sec),
    fixNumber(f),
    handTransform,
    identStyle,
    redStyle,
    redTransform,
    greenStyle,
    greenTransform,
  ].join('","') + `")`;
}

function createAudio(config, task) {
  [
    "pip_0.1.wav",
    "pip_0.5.wav",
    "silence_0.5.wav",
    "silence_0.9.wav",
    "silence_1.0.wav"
  ].forEach(f => {
    fs.copyFileSync(process.cwd() + '/pips/' + f, config.project.frames + f);
  });

  let files = [],
    sec = task.duration;
  // In lead-in silence
  for (; sec > 10; sec--) {
    files.push('silence_1.0.wav')
  }
  // in Ident (10s) pip every second
  for (; sec > 1; sec--) {
    files.push('pip_0.1.wav', 'silence_0.9.wav')
  }
  // last second is a long pip
  if (sec > 0) {
    files.push('pip_0.5.wav', 'silence_0.5.wav')
  }
  return files
}

function Ident(config, task) {
  // Number of frames this task runs for
  const frameCount = config.video.frameRate * task.duration;
  return {
    page: "http://localhost:8001/clipident/index.html", // page to load
    init: init,                                         // Hook to init each frame
    updateFrame: updateFrame,                           // hook to call for each frame
    createAudio: createAudio,                           // hook to add audio
    startAngle: 360 - (6 * task.duration),              // Starting angle for the clock hand
    cx: 960,                                            // Clock centre coordinate
    cy: 1080,                                           // Clock centre coordinate
    cr: 1080 * 2 / 3                                    // Clock radius
  }
}

module.exports = Ident;
