const duration = 30,                      // Duration in s
  framesPerSecond = 25,                   // Frames per second
  maxFrames = duration * framesPerSecond; // Total number of frames

const cx = 960,
  cy = 1080,
  // Clock radius
  cr = cy * 2 / 3;

const fixNumber = (v => (("00" + (v).toFixed(0))).substr(-2));


function clockAngle(angle, minAngle, maxAngle) {
  return angle >= maxAngle ? maxAngle : angle <= minAngle ? minAngle : angle;
}

const clock = document.getElementById("clock")

const secToAngle = ((sec) => 360 - (sec * 6));

function demo(frame) {
  // Countdown so get frame count from the end.
  // The -1 here means the last frame will show 00:00.
  const trueFrame = maxFrames - frame - 1;

  // Seconds & frame in second
  // For countdown clocks we need Math.ceil() here.
  // If this was a count-up clock then Math.floor() would be used.
  const sec = Math.ceil(trueFrame / framesPerSecond),
    f = trueFrame % framesPerSecond;

  const clockDocument = clock.contentDocument,
    clockHand = clockDocument.getElementById('clock-hand'),
    clockGreen = clockDocument.getElementById('clockGreen'),
    clockRed = clockDocument.getElementById('clockRed'),
    angle = secToAngle(sec),
    greenAngle = clockAngle(sec, 10, 45),
    redAngle = clockAngle(sec, 0, 10),
    hidden = "stroke:none;fill:none",
    greenShow = greenAngle < 45,
    greenStyle = greenShow ? "stroke-width:5;stroke:#00ff00;fill:none" : hidden,
    redShow = redAngle < 10,
    redStyle = redShow ? "stroke-width:5;stroke:red;fill:none" : hidden;

  //clockHand.setAttribute("stroke", "red")
  clockHand.setAttribute("transform", "rotate(" + angle + " " + cx + " " + cy + ")")

  clockRed.setAttribute("style", redStyle);
  if (redShow) {
    clockRed.setAttribute("d", f_svg_ellipse_arc(
      [cx, cy],
      [cr, cr],
      [0, (6 * (10 - redAngle)) / 180 * π],
      210 / 180 * π
    ));
  }

  clockGreen.setAttribute("style", greenStyle);
  if (greenShow) {
    clockGreen.setAttribute("d", f_svg_ellipse_arc(
      [cx, cy],
      [cr, cr],
      [0, (6 * (45 - greenAngle)) / 180 * π],
      0
    ));
  }

  document.getElementById("seconds").textContent = fixNumber(sec);
  document.getElementById("frames").textContent = fixNumber(f);

}

clock.addEventListener("load", function () {
  let frame = 0;
  setInterval(function () {
    if (frame < maxFrames) {
      demo(frame);
      frame++;
    }
  }, 1000 / framesPerSecond)
})
