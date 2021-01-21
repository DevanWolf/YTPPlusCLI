const global = require("../global"),
	fs = require("fs");
module.exports = {
	plugin: (video, toolbox, cwd, debug) => {
		var temp = cwd + "/shared/temp/temp.mp4";
		if (fs.existsSync(temp))
			fs.unlinkSync(temp);
		if (fs.existsSync(video))
			fs.renameSync(video,temp);
		var command = " -i \"" + temp + "\""
				+ " -ar 44100"
				+ " -vf scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1,fps=fps="+toolbox.fps
				+ " -filter:v setpts=0.5*PTS -filter:a atempo=2.0 -y \"" + video + "\"";
		global.ffmpeg.runSync(command + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		fs.unlinkSync(temp);
		return true
  	}
};
