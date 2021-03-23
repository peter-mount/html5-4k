function timecode(s1, s2) {
  let tc1 = document.getElementById("timecode1");
  if (!tc1) {
    tc1 = document.createElement("div");
    tc1.setAttribute("id", "timecode1");
    tc1.setAttribute("style", [
      "position: absolute",
      "top:0",
      "left:0",
      "right: 0",
      "font-family: monospace",
      "font-size: 2em",
      "height: 1.25em",
      "border-bottom: 1px solid white",
      "color:white",
      "background:black",
      "opacity: 60%",
      "z-index: 1000",
      "overflow:hidden",
      "padding:0 0.25em 0 0.25em"
    ].join(';'));
    document.body.appendChild(tc1);
  }
  tc1.textContent = s1;

  let tc2 = document.getElementById("timecode2");
  if (!tc2) {
    tc2 = document.createElement("div")
    tc2.setAttribute("id", "timecode2");
    tc2.setAttribute("style", [
      "position: absolute",
      "top:0",
      "right: 0",
      "font-family: monospace",
      "font-size: 2em",
      "height: 1.25em",
      "width:2000px",
      "color:white",
      "opacity: 60%",
      "z-index: 1001",
      "overflow:hidden",
      "text-align:right",
      "padding-right:0.25em",
      "display:block"
    ].join(';'));
    document.body.appendChild(tc2);
  }
  tc2.textContent = s2;
}

const fixNumber = ((v, s) => (("00000000" + (v).toFixed(0))).substr(-s, s));

function init(config, frameCount) {
  config.timeStart = new Date().getTime();
  // Number of digits that frameCount requires to display
  config.frameLength = Math.floor(Math.log10(frameCount) + 1);
}

function updateFrame(trueFrame, config, task) {
  const enabled = config.video.timecode ? config.video.timecode.visible : false;
  if (!enabled) {
    return null
  }

  const fsec = Math.floor(trueFrame / config.video.frameRate),
    sec = fsec % 60,
    min = Math.floor(fsec / 60) % 60,
    hr = Math.floor(fsec / 3600),
    f = trueFrame % config.video.frameRate,
    now = new Date(),
    elapsed = (now.getTime() - config.timeStart) / 1000,
    elFsec = Math.floor(elapsed),
    elSec = elFsec % 60,
    elMin = Math.floor(elFsec / 60) % 60,
    elHr = Math.floor(elFsec / 3600),
    s1 = [
      [fixNumber(hr, 2), fixNumber(min, 2), fixNumber(sec, 2), fixNumber(f, 2)].join(':'),
      config.video.frameRate + "/s",
      fixNumber(trueFrame, config.frameLength),
      config.project.project
    ].join(" "),
    s2 = [
      config.project.title,
      task ? "[" + task.name + "]" : "",
      now.toISOString(),
      [fixNumber(elHr, 2), fixNumber(elMin, 2), fixNumber(elSec, 2)].join(':')
    ].join(" ");
  return `(${timecode})("${s1}","${s2}")`;
}

function eta(config, trueFrame, frameCount) {
  if (trueFrame === 0) {
    return "??:??"
  }
  return time(config, (frameCount - trueFrame) / trueFrame)
}

function duration(config, trueFrame, frameCount) {
  if (trueFrame === 0) {
    return "??:??"
  }
  return time(config, frameCount / trueFrame)
}

function time(config, factor) {
  const now = new Date(),
    elapsed = (now.getTime() - config.timeStart) / 1000,
    remaining = factor * elapsed,
    elFsec = Math.floor(remaining),
    elSec = elFsec % 60,
    elMin = Math.floor(elFsec / 60) % 60,
    elHr = Math.floor(elFsec / 3600),
    ret = [];
  if (elHr > 0) {
    ret.push(fixNumber(elHr, 2));
  }
  ret.push(fixNumber(elMin, 2));
  ret.push(fixNumber(elSec, 2));
  return ret.join(':');
}

function fps(config, frame) {
  const now = new Date(),
    elapsed = (now.getTime() - config.timeStart) / 1000,
    fps = elapsed > 0 ? (frame / elapsed) : 0;
  return fps
}

module.exports = {
  init: init,
  updateFrame: updateFrame,
  eta: eta,
  duration: duration,
  fps: fps
}
