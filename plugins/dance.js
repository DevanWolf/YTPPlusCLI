const global = require("../global"),
	fs = require("fs");
module.exports = {
	plugin: (video, toolbox, cwd, debug) => {
		var input = video,
			temp = cwd + "/shared/temp/temp.mp4", //og file
			temp2 = cwd + "/shared/temp/temp2.mp4", //1st cut
			temp3 = cwd + "/shared/temp/temp3.mp4", //backwards (silent)
			temp4 = cwd + "/shared/temp/temp4.mp4", //forwards (silent)
			temp5 = cwd + "/shared/temp/temp5.mp4", //backwards & forwards concatenated
			temp6 = cwd + "/shared/temp/temp6.mp4"; //backwards & forwards concatenated
		
		// final result is backwards & forwards concatenated with music
		
		if (fs.existsSync(input))
			fs.renameSync(input,temp);
		if (fs.existsSync(temp2))
			fs.unlinkSync(temp2);
		if (fs.existsSync(temp3))
			fs.unlinkSync(temp3);
		if (fs.existsSync(temp4))
			fs.unlinkSync(temp4);
		if (fs.existsSync(temp5))
			fs.unlinkSync(temp5);
		if (fs.existsSync(temp6))
			fs.unlinkSync(temp6);
		
		var soundDir = cwd + "/shared/music";

		if (!fs.existsSync(soundDir))
			fs.mkdirSync(soundDir) //init plugin

		var readDir = fs.readdirSync(soundDir),
			randomSound = readDir[global.randomInt(0,readDir.length)],
			randomTime = global.randomInt(3,9),
			randomTime2 = global.randomInt(0,1);

		if(!randomSound) {
			if(debug) console.log("\nNo sounds exist in directory '"+soundDir+"'!")
			return false
		}

		let commands = [];

		commands.push("-i " + temp + " -map 0"// -c:v copy"
				+ " -ar 44100"
				+ " -to 00:00:0"+randomTime2+"." + randomTime
				+ " -vf scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1"
				+ " -an"
				+ " -y " + temp2);
		
		commands.push("-i " + temp2 + " -map 0"// -c:v copy"
				+ " -ar 44100"
				+ " -vf reverse,scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1"
				+ " -y " + temp3);
		
		commands.push("-i " + temp3
				+ " -ar 44100"
				+ " -vf reverse,scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1"
				+ " -y " + temp4);
		
		commands.push("-i " + temp3
				+ " -i " + temp4
				+ " -filter_complex \"[0:v:0][1:v:0][0:v:0][1:v:0][0:v:0][1:v:0][0:v:0][1:v:0]concat=n=8:v=1[outv]\""
				+ " -map \"[outv]\""
				+ " -c:v libx264 -shortest"
				+ " -y " + temp5);
		
		commands.push("-i " + temp5
				+ " -map 0"
				+ " -ar 44100"
				+ " -vf \"setpts=0.5*PTS,scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1\""
				+ " -af \"atempo=2.0\""
				+ " -shortest"
				+ " -y " + temp6);
		
		commands.push("-i " + temp6
				+ " -i " + soundDir + "/" + randomSound
				+ " -c:v libx264"
				+ " -map 0:v:0 -map 1:a:0"
				+ " -vf \"scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1,fps=fps="+toolbox.fps+"\""
				+ " -shortest"
				+ " -y " + video);
		
		for (var i = 0; i < commands.length; i++) {
			global.ffmpeg.runSync(commands[i] + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		}
		
		fs.unlinkSync(temp);
		fs.unlinkSync(temp2);
		fs.unlinkSync(temp3);
		fs.unlinkSync(temp4);
		fs.unlinkSync(temp5);
		fs.unlinkSync(temp6);

		return true
  	}
};
