# World Map animation

This is an example of an animated Earth rotating once on it's axis.

## Configuration

The `worldmap.yaml` file contains the configuration for this project.

### project definition
    project:
      title: "World Map"                  # Title of the project
      project: "Video-Ident"              # Project name
      type: "4K HTML5 Animation Example"  # Project type
      author:                             # Project author
        - Peter Mount
        - area51.media
        - peter@area51.dev
      output: /frames/test.mp4            # Final video
      frames: /frames/                    # Temp directory to store the frames

### Video settings
For standard 4K video at 25 fps, timecode shown at the top of each frame.

    video:
      width: 3840   # 4k width in pixels
      height: 2160  # 4k height in pixels
      frameRate: 25 # Video output frame rate
      timecode:
        visible: true   # Show time code on every frame

### The modules to run.

Here we have the ident animation at the start displaying the details from the `project:` section then the animation
itself.

    modules:
      -
        name: "ident"               # Our standard ident page
        path: "./clipident/ident"   # Path to js module
        duration: 6                 # Duration in seconds, default is 6, max 45, min 1
        showFrames: false           # true then show frame count
        smoothArc: false            # true then arcs progress by frames not per second
      -
        name: "worldmap"
        path: "./examples/worldmap/index.js"  # path to js module for the animation
        duration: 72                          # Duration in seconds, 72*5 = 360 or 1 revolution
        speed: 5                              # speed in degrees per second

Here the worldmap animation runs for 72 seconds, rotating the Earth 5 degrees every second - 72 * 5 = 360 so one entire revolution.

## Rendered result

You can see the final result of this animation on [YouTube](https://www.youtube.com/watch?v=xx4r90mu8fI)

[![Rendered result](http://img.youtube.com/vi/xx4r90mu8fI/0.jpg)](http://www.youtube.com/watch?v=xx4r90mu8fI "Rendered result")
