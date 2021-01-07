const global = require("../global");

module.exports = {
  plugin: (video, toolbox, cwd, debug) => {
    console.log("plugin!")
    return true
  }
};
