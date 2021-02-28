#!/bin/bash
#
# Using the supplied wav files (generated in audacity), create the Greenwich Time Signal consisting of:
# 5 pips, 1000Hz 0.1s then 0.9s silence
# 1 pip,  1000Hz 0.5s then 0.5s silence
#
TEMPFILE=pips.txt

(
  # 5 .1s pips
  for sec in $(seq 1 5); do
    echo "file 'pip_0.1.wav'"
    echo "file 'silence_0.9.wav'"
  done

  # 1 0.5s pip
  echo "file 'pip_0.5.wav'"
  echo "file 'silence_0.5.wav'"
) >${TEMPFILE}

ffmpeg -y -f concat -i ${TEMPFILE} greenwich-pips.wav
