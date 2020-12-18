const global = require("../libs/global");

module.exports = {
  plugin: (video, width, height, temp, shared) => {
    console.log("plugin!")
    return true
  }
};
