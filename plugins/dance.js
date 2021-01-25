const global = require("../global"),
	fs = require("fs");
module.exports = {
	plugin: (video, toolbox, cwd, debug) => {
		var input = video,
			temp = cwd + "/shared/temp/temp.mp4",
			temp2 = cwd + "/shared/temp/temp2.mp4",
		
		// final result is backwards & forwards concatenated with music
		
		if (fs.existsSync(temp))
			fs.unlinkSync(temp);
		if (fs.existsSync(temp2))
			fs.unlinkSync(temp2);
		
		if (fs.existsSync(input))
			fs.renameSync(input,temp);

		var soundDir = cwd + "/shared/music";

		if (!fs.existsSync(soundDir))
			fs.mkdirSync(soundDir) //init plugin

		var readDir = fs.readdirSync(soundDir),
			randomSound = readDir[global.randomInt(0,readDir.length-1)],
			randomTime = (global.randomInt(3,19) / 10);

		if(!randomSound) {
			if(debug) console.log("\nNo sounds exist in directory '"+soundDir+"'!")
			return false
		}

		let commands = [];

		commands.push("-i \"" + temp + "\" -an -c:v copy -to " + randomTime + " -y \"" + temp2 + "\"");
		
		commands.push("-i \"" + temp2 + "\" -vf reverse -y \"" + temp + "\"");
		
		commands.push("-i \"" + temp + "\" -i \"" + temp2 + "\" -i \"" + soundDir + "/" + randomSound + "\" -filter_complex \"[0:v][1:v][0:v][1:v][0:v][1:v][0:v][1:v]concat=n=8:v=1,setpts=.5*PTS[out]\" -map [out] -map 2:a -ar 44100 -ac 2 -disposition:a:0 default -shortest -map_metadata -1 -y \"" + video + "\"");
		
		for (var i = 0; i < commands.length; i++) {
			global.ffmpeg.runSync(commands[i] + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		}
		
		fs.unlinkSync(temp);
		fs.unlinkSync(temp2);

		return true
  	}
};
