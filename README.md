# HTML5 4K - suite of tools to generate 4K animations in HTML5

This is a suite of tools to generate animations in 4K using just HTML5.

It consists of:

* NodeJS library to manage the generation of the frames of the video
* ltc-tools for generating LTC timecode data
* Docker container containing chromium, nodejs, ltc-tools & ffmpeg for headless generation
* Example animations

## Work in progress

Note: This project is still a work in progress but is in a state where it's starting to be usable.

### ToDo

* Add support for including a ltc time-code audio stream
* Alternate video formats other than MP4
* Make the docker container public (currently it depends on another project which isn't yet public)

## Examples

The following are a list of available examples:

* ident - example of rendering just an ident. This is visible at the start if each clip in the other examples.
* orbitsimulator - example of animating stellar movement over 700,000 years
  [![Rendered result](http://img.youtube.com/vi/Vn_eFtZVImo/0.jpg)](http://www.youtube.com/watch?v=Vn_eFtZVImo "Rendered result")
  
* worldmap - The Earth rotating in 4K 25 fps
  [![Rendered result](http://img.youtube.com/vi/xx4r90mu8fI/0.jpg)](http://www.youtube.com/watch?v=xx4r90mu8fI "Rendered result")
