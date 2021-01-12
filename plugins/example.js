const global = require("../global");

module.exports = {
  plugin: (video, toolbox, cwd, debug) => {
    if(debug) console.log("example plugin!")
    return true
  }
};
