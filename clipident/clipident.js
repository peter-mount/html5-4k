"use strict";
var page = require('webpage').create(),
    system = require('system'),
    address, output, size, pageWidth, pageHeight,
    startSec, frameRate, cx, cy;

console.error(system.args);

output = system.args[1]
pageWidth = parseInt(system.args[2], 10);
pageHeight = parseInt(system.args[3], 10);
frameRate = parseInt(system.args[4], 10);
startSec = parseInt(system.args[5], 10);
cx = parseInt(system.args[6], 10);
cy = parseInt(system.args[7], 10);

page.viewportSize = {width: 600, height: 600};
page.viewportSize = {width: pageWidth, height: pageHeight};
page.clipRect = {top: 0, left: 0, width: pageWidth, height: pageHeight};


// Bind page logging to our error console
page.onConsoleMessage = function (msg) {
    console.error(msg);
};

/*
page.onResourceRequested = function(request) {
  console.error('Request ' + JSON.stringify(request, undefined, 4));
};

page.onResourceReceived = function(response) {
  console.error('Receive ' + JSON.stringify(response, undefined, 4));
};
 */

page.open("file:///work/ident.svg", function (status) {
    if (status !== 'success') {
        console.error('Unable to load the address!');
        phantom.exit(1);
    } else {

        window.setTimeout(function () {
            var maxFrame = startSec * frameRate
            var stepSize = 6 * startSec / maxFrame
            var startAngle = 360 - (6 * startSec)

            for (var frame = 0; frame < maxFrame; frame++) {
                var sec = Math.floor(frame / frameRate)

                page.evaluate(function (clockHandAngle, cx, cy) {
                    var e = document.getElementById('clock-hand')

                    e.setAttribute("stroke", "red")
                    e.setAttribute("transform", "rotate(" + clockHandAngle + " " + cx + " " + cy + ")")
                }, startAngle + (6 * sec), cx, cy);
                //}, startAngle+(frame * stepSize));

                var out = "000000" + frame
                out = "frames/test-" + out.substr(-6, 6) + ".png";
                console.error("Rendering frame " + out + " " + frame + "/" + maxFrame);
                page.render(out);
            }

            //page.render(output);
            phantom.exit();
        }, 200);
    }
})

