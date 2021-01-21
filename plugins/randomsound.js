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
		var command = " -i \"" + cwd + "/shared/temp/temp.mp4\""
			+ " -i \"" + soundDir + "/" + randomSound + "\""
			+ " -filter_complex \"[1:a]volume=1,apad[A];[0:a][A]amerge[out]\""
			+ " -ac 2"
			//+ " -c:v copy"
			
			+ " -ar 44100"
			+ " -vf scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1,fps=fps="+toolbox.fps
			+ " -map 0:v"
			+ " -map [out]"
			+ " -y \"" + video + "\"";
		global.ffmpeg.runSync(command + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		fs.unlinkSync(temp);
		return true
  	}
};
