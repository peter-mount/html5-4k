# clipident example

This simple example renders the clip ident on it's own.
You can use the ident.yaml file as the basis for new projects.

## Configuration

### project definition
This module uses the `title`, `project`, `type` & `author` fields in the project section:

    project:
      title: "Simple Video Ident"         # Title of the project
      project: "Video-Ident"              # Project name
      type: "4K HTML5 Animation Example"  # Project type
      author:                             # Project author
        - Peter Mount
        - area51.media
        - peter@area51.dev
      output: /frames/test.mp4            # Final video
      frames: /frames/                    # Temp directory to store the frames

Then in the modules section, set the first module with:

    modules:
      -
        name: "ident"               # Our standard ident page
        path: "./clipident/ident"   # Path to js module
        duration: 6                 # Duration in seconds, default is 6, max 45, min 1
        showFrames: false           # true then show frame count
        smoothArc: false            # true then arcs progress by frames not per second

Here we set the duration to 6 seconds (usually best) so that it counts down from 6 to 0.
* showFrames is best kept to false.
  If true then the counter in the clock will also show the seconds:frame instead of just the seconds remaining.
* smoothArc is also best kept to false.
  If true then the coloured arcs on the clock will progress smoothly between each second rather than snap with the clock hand.
