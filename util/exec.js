const child_process = require('child_process');

function Exec(cmd) {
  child_process.execSync(cmd.join(" "), {
    // Use process stdio so we see ffmpeg output in real time
    stdio: [process.stdin, process.stdout, process.stderr]
  });
}

module.exports = Exec;
