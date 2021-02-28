#!/bin/bash

cd /work

echo "Cleaning up"
rm -f /frames/*.png /frames/*.mp4 /frames/*.wav

echo "Starting chromium"
chromium-headless &

echo "Starting webserver"
python3 -m http.server 8001 -b 0.0.0.0 &

# pause a second to allow chromium & python to start up
sleep 1

# Generate the content
echo "Generating frames"
nodejs index.js examples/worldmap/worldmap.yaml

echo "Completed"
