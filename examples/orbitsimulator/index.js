function OrbitSimulator(config, task) {
  return {
    prePageLoad: prePageLoad, // Hook to get page from the yaml
    init: init,               // Hook called when the page loads
    updateFrame: updateFrame, // Hook to call for each frame
  }
}

// Before loading the page get the url from the yaml
function prePageLoad(frame, trueFrame, config, task) {
  // Set page from the yaml as it can be changed to each sim
  task.config.page = task.page;
}

// After the page loads hide the controls as not needed in the video
function init(frame, trueFrame, config, task) {
  return [
    '$(".classControlDiv").hide()',                       // Hide controls
    '$("#btnHideControls").hide()',                       // Hide control visibility button
    '$("#rangeYears").val(' + (task.year - 2000) + ')',   // set start year
    'updateSlider()',
    '$("#rangeSimSpeed").val(' + task.speed + ')',        // set sim speed
    'changeSimSpeed()',
    '$("#rangeZoom").val(' + task.zoom + ')',             // set zoom
    'zoom()',
    // Move year display, so it's visible & updates per frame
    '$(\'body\').append($(\'#lblYears\').css(\'top\',\'10px\'))',
    // Move Sim speed display so it's visible
    '$(\'body\').append($(\'#lblSimSpeed\').css(\'top\',\'30px\'))',
    // Hide scroll bars
    '$(\'body\').css(\'overflow\',\'hidden\')'
  ].join(';')
}

// Just call Advance() in the page to move 1 frame
function updateFrame(frame, trueFrame, config, task) {
  return 'Advance()';
}

module.exports = OrbitSimulator;
