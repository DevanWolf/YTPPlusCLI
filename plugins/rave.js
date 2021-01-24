/* CONVERTED FOR USE IN INFINITY */
/* rave.js by TeamPopplio - Version 1.0.0 */

const pluginConfig =

{
	/*
		Config:
		Set the following values:
	*/
	MusicDirectory:"/shared/rave/", //Must be '/' appended, adjacent to working directory.
},

/* Plugin code below: */

global = require("../global"),
fs = require("fs");

module.exports = {
	plugin: (video, toolbox, cwd, debug) => {
		//Set variables
		var input = video,
			temp = cwd + "/shared/temp/temp.mp4", //og file
			temp2 = cwd + "/shared/temp/temp2.mp4",
			temp3 = cwd + "/shared/temp/temp3.mp4",
			temp4 = cwd + "/shared/temp/temp4.mp4",
			temp5 = cwd + "/shared/temp/temp5.mp4",
			temp6 = cwd + "/shared/temp/temp6.mp4",
			temp7 = cwd + "/shared/temp/temp7.mp4",
			temp8 = cwd + "/shared/temp/temp8.mp4",
			temp9 = cwd + "/shared/temp/temp9.mp4",
			temp10 = cwd + "/shared/temp/temp10.mp4",
			temp11 = cwd + "/shared/temp/temp11.mp4",
			temp12 = cwd + "/shared/temp/temp12.mp4",
			temp13 = cwd + "/shared/temp/temp13.mp4",
			temp14 = cwd + "/shared/temp/temp14.mp4";

		//Delete temporary files
		if (fs.existsSync(temp))
			fs.unlinkSync(temp);
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
		if (fs.existsSync(temp7))
			fs.unlinkSync(temp7);
		if (fs.existsSync(temp8))
			fs.unlinkSync(temp8);
		if (fs.existsSync(temp9))
			fs.unlinkSync(temp9);
		if (fs.existsSync(temp10))
			fs.unlinkSync(temp10);
		if (fs.existsSync(temp11))
			fs.unlinkSync(temp11);
		if (fs.existsSync(temp12))
			fs.unlinkSync(temp12);
		if (fs.existsSync(temp13))
			fs.unlinkSync(temp13);
		if (fs.existsSync(temp14))
			fs.unlinkSync(temp14);

		//Copy video to a temporary file
		if (fs.existsSync(input))
			fs.copyFileSync(input,temp);

		if (!fs.existsSync(cwd+"/"+pluginConfig.MusicDirectory))
			fs.mkdirSync(cwd+"/"+pluginConfig.MusicDirectory)

		//Get rave music
		var readDir = fs.readdirSync(cwd+"/"+pluginConfig.MusicDirectory),
			randomSound = readDir[global.randomInt(0,readDir.length-1)];

		if(!randomSound) {
			if(debug) console.log("\nNo sounds exist in directory '"+pluginConfig.MusicDirectory+"'!");
			return false
		}

		let commands = [];

		//Execute FFMPEG
		commands.push("-i \""+temp+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0,scale="+toolbox.width+"x"+toolbox.height+",setsar=1:1,fps=fps="+toolbox.fps+"[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp2+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp2+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.1[vid2];[1:v][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp3+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp3+"\" -filter_complex \"[1:v]reverse[vid];[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.25[vid2];[vid][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp4+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp4+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.1[vid2];[1:v][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp5+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp5+"\" -filter_complex \"[1:v]reverse[vid];[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.25[vid2];[vid][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp6+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp6+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.1[vid2];[1:v][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp7+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp7+"\" -filter_complex \"[1:v]reverse[vid];[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.25[vid2];[vid][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp8+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp8+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.1[vid2];[1:v][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp9+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp9+"\" -filter_complex \"[1:v]reverse[vid];[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.25[vid2];[vid][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp10+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp10+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.1[vid2];[1:v][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp11+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp11+"\" -filter_complex \"[1:v]reverse[vid];[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.25[vid2];[vid][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp12+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp12+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.1[vid2];[1:v][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp13+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp13+"\" -filter_complex \"[1:v]reverse[vid];[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.25[vid2];[vid][vid2]concat=n=2:v=1[outv]\" -ac 2 -ar 44100 -map [outv] -y \""+temp14+"\"");
		commands.push("-i \""+temp+"\" -i \""+temp14+"\" -i \""+cwd+"/"+pluginConfig.MusicDirectory+randomSound+"\" -filter_complex \"[0:v]frei0r=filter_name=nervous,frei0r=filter_name=colorize:filter_params=0.1[vid2];[1:v][vid2]concat=n=2:v=1[outv];[2:a]volume=1[aud]\" -ac 2 -ar 44100 -map [aud] -map [outv] -t 3.5 -y \""+video+"\"");

		for (var i = 0; i < commands.length; i++) {
			global.ffmpeg.runSync(commands[i] + (debug == false ? " -hide_banner -loglevel quiet" : ""));
		}
		
		fs.unlinkSync(temp);
		fs.unlinkSync(temp2);
		fs.unlinkSync(temp3);
		fs.unlinkSync(temp4);
		fs.unlinkSync(temp5);
		fs.unlinkSync(temp6);
		fs.unlinkSync(temp7);
		fs.unlinkSync(temp8);
		fs.unlinkSync(temp9);
		fs.unlinkSync(temp10);
		fs.unlinkSync(temp11);
		fs.unlinkSync(temp12);
		fs.unlinkSync(temp13);
		fs.unlinkSync(temp14);
		return true
  	}
};
