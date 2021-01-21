const global = require("../global"),
	fs = require("fs");
module.exports = {
	plugin: (video, toolbox, cwd, debug) => {
		var temp = cwd + "/shared/temp/temp.mp4",
			temp2 = cwd + "/shared/temp/temp2.mp4";

		if (fs.existsSync(temp))
			fs.unlinkSync(temp);
		if (fs.existsSync(temp2))
			fs.unlinkSync(temp2);
		if (fs.existsSync(video))
			fs.renameSync(video,temp);

		var command = "-i \"" + temp + "\""
			+ " -ar 44100"
			+ " -vf scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1,fps=fps="+toolbox.fps
			+ " -af \"areverse\" -y \"" + temp2 + "\"";
		var command2 = "-i " + temp2
			+ " -ar 44100"
			+ " -vf scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1,fps=fps="+toolbox.fps
			+ " -vf reverse -y \"" + video + "\"";
		global.ffmpeg.runSync(command + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		global.ffmpeg.runSync(command2 + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		fs.unlinkSync(temp);
		fs.unlinkSync(temp2);
		return true
  	}
};
