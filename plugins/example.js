const global = require("../global");

module.exports = {
  plugin: (video, toolbox, cwd) => {
    console.log("plugin!")
    return true
  }
};
