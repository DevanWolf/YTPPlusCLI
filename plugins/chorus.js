const global = require("../global"),
	fs = require("fs");
module.exports = {
	plugin: (video, toolbox, cwd, debug) => {
		var temp = cwd + "/shared/temp/temp.mp4";
		if (fs.existsSync(temp))
			fs.unlinkSync(temp);
		if (fs.existsSync(video))
			fs.renameSync(video,temp);
		var command = "-i \"" + temp + "\" -c:v copy -af chorus=\".5:.9:50|60|40:.4|.32|.3:.25|.4|.3:2|2.3|1.3\" -y \"" + video + "\"";
		global.ffmpeg.runSync(command + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		fs.unlinkSync(temp);
		return true
  	}
};
