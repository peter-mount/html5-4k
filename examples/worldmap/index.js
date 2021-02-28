function WorldMap(config, task) {
  return {
    page: "http://localhost:8001/examples/worldmap/",   // page to load
    init: init,                                         // Hook to init each frame
    updateFrame: updateFrame,                           // hook to call for each frame
    //createAudio: createAudio,                           // hook to add audio
    // Start position
    startLon: task.start && task.start.longitude ? task.start.longitude : 0,
  }
}

function init(frame, trueFrame, config, task) {
  // Convert speed from second into frames
  task.frameSpeed = task.speed / config.video.frameRate;
  return updateFrame(frame,trueFrame,config,task);
}

function updateFrame(frame, trueFrame, config, task) {
  let ang = (frame * task.frameSpeed) % 360;
  return `rotateMap([` + ang + '])';
}

module.exports = WorldMap;
