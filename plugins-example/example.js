const global = require("../global");
/* Rename plugins-example to plugins */
module.exports = {
	/**
	 * @param {string} video C:\YTPPlusCLI/shared/temp/video17.mp4
	 * @param {Object} toolbox {"input":"videos.txt","output":"output.mp4","clips":20,"minstream":0.2,"maxstream":0.4,"width":640,"height":480,"fps":30,"usetransitions":false,"debug":false,"plugins":["chorus.js"],"plugintest":"chorus.js"}
	 * @param {string} cwd C:\YTPPlusCLI
	 * @param {boolean} debug Use this to determine whether or not to output to console.
	 */
	plugin: (video, toolbox, cwd, debug) => {
		if(debug) console.log("example plugin!")
		return true
  	}
};
