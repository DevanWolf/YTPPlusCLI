const global = require("../global"),
	fs = require("fs");
module.exports = {
	plugin: (video, toolbox, cwd, debug) => {
		var temp = cwd + "/shared/temp/temp.mp4",
			soundDir = cwd + "/shared/sounds";

		if (!fs.existsSync(soundDir))
			fs.mkdirSync(soundDir) //init plugin

		var readDir = fs.readdirSync(soundDir),
			randomSound = readDir[global.randomInt(0,readDir.length-1)];

		if(!randomSound) {
			if(debug) console.log("\nNo sounds exist in directory '"+soundDir+"'!")
			return false
		}
		if (fs.existsSync(temp))
			fs.unlinkSync(temp);
		if (fs.existsSync(video))
			fs.renameSync(video,temp);
		var command = "-i \"" + temp + "\" -i \"" + soundDir + "/" + randomSound + "\" -map 0:v -map 1:a -ar 44100 -ac 2 -c:v copy -disposition:a:0 default -shortest -map_metadata -1 -y \"" + video + "\"";
		global.ffmpeg.runSync(command + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		fs.unlinkSync(temp);
		return true
  	}
};
