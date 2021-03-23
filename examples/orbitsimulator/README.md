# OrbitSimulator

This example show how to render orbital simulations using the online [orbit simulator](http://orbitsimulator.com/)

The idea behind this example came from this [tweet](https://twitter.com/tony873004/status/1372363453998923777) by [@tony873004](https://twitter.com/tony873004):

`The Southern Pole star is not as simple. There is a lot more proper motion downstairs. Rather than stars sitting around waiting for the pole to point to them, the stars migrate into the path of the pole. Sirius will be the Southern Star twice in the next quarter million years.` 

As that simulator is pure HTML5 it's an ideal candidate for converting into 4K video.

## Is it compatible

The simulator only has a play button not a step, so we need to see if we can implement that. The source is uncompressed
in the browser so looking at it and play is simply the line

    playing = setInterval(function(){Advance()}, 10);

This is good as we can use the `Advance()` method to advance 1 frame. Trying this in the browser's console confirms this.

## Rendered result

You can see the final result of this animation on [YouTube](https://www.youtube.com/watch?v=Vn_eFtZVImo)

[![Rendered result](http://img.youtube.com/vi/Vn_eFtZVImo/0.jpg)](http://www.youtube.com/watch?v=Vn_eFtZVImo "Rendered result")
