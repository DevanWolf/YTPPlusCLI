"use strict";
/* Includes */
const fs = require("fs"),
	global = require("./global"),
	plugins = require("./plugins");

function go(toolbox) {
	try {
		/* Input handling */
		let inputfiles;
		if(toolbox.input)
			inputfiles = fs.readFileSync(toolbox.input, {encoding:"utf-8"}).toString().split("\n"); //Input is a text file as specified by command line
		else
			inputfiles = ""; //This will only happen if the input text file is empty
		if (inputfiles.length <= 0) {
			if(!toolbox.silent)
				console.log("\nNo sources added...");
			return process.exit(1);
		}
		if (fs.existsSync(toolbox.output))
			fs.unlinkSync(toolbox.output); //Delete the output file so we can replace it without issue
		cleanUp(toolbox.clips, toolbox.cleanUp); //Remove old working files and directories
		for (var i = 0; i < toolbox.clips; i++) {
			var sourceToPick = inputfiles[global.randomInt(0, inputfiles.length-1)];
			var data = global.getVideoProbe(sourceToPick);
			var length = data.duration;
			var startOfClip = randomvar(0, length - toolbox.maxstream);
			var endOfClip = startOfClip + randomvar(toolbox.minstream, toolbox.maxstream);
			if(toolbox.debug) //Copied from YTP+ for redundancy
			{
				console.log("\nSource: "+sourceToPick);
				console.log("\nLength: "+length);
				console.log("\nSTARTING CLIP " + "video" + i);
				console.log("\nBeginning of clip " + i + ": " + startOfClip);
				console.log("\nEnding of clip " + i + ": " + endOfClip + ", in seconds: ");
			}
			if (global.randomInt(0, 15) == 15 && toolbox.usetransitions==true) {
				if(toolbox.debug)
					console.log("\nTryina use a diff source");
				global.copyVideo(pickSource(toolbox.transitions), process.cwd()+"/shared/temp/video" + i, [toolbox.width, toolbox.height], toolbox.fps, toolbox.debug);
			} else {
				global.snipVideo(sourceToPick, startOfClip, endOfClip, process.cwd()+"/shared/temp/video" + i, [toolbox.width, toolbox.height], toolbox.fps, toolbox.debug);
			}
			//Add a random effect to the video
			var int = (toolbox.plugintest ? 0 : global.randomInt(0, toolbox.plugins.length+5));
			if(int < toolbox.plugins.length && toolbox.plugins.length != 0) {
				if(toolbox.plugins[int] != "") {
					var effect = toolbox.plugins[int];
					if(toolbox.debug)
						console.log("\nSTARTING EFFECT ON CLIP " + i + " EFFECT " + effect);
					var clipToWorkWith = process.cwd()+"/shared/temp/video" + i + ".mp4";
					plugins[effect].plugin(clipToWorkWith, toolbox, process.cwd(), toolbox.debug);
				}
			}
		}
		global.concatenateVideo(toolbox.clips, toolbox.output, toolbox.debug);
	} catch (ex) {
		process.stdin.resume();
		if(!toolbox.silent) {
			console.log("\nAn error has occured.")
			console.log("\n"+ex)
		}
		return process.exit(1);
	}
	cleanUp(toolbox.clips);
	fs.rmdirSync(process.cwd()+"/shared/temp/");
	process.exit(0); //All done here
}

function randomvar(min, max) {
	var finalVal = -1;
	while (finalVal<0) {
		var x = (Math.random() * ((max - min) + 0)) + min;
		finalVal=Math.round(x * 100.0) / 100.0; 
	}
	return finalVal;
}


function cleanUp(clips, debug) {
	if (fs.existsSync(process.cwd()+"/shared/temp/temp.mp4"))
		fs.unlinkSync(process.cwd()+"/shared/temp/temp.mp4");
	if (fs.existsSync(process.cwd()+"/concat.txt"))
		fs.unlinkSync(process.cwd()+"/concat.txt")
	for (var i=0; i<clips; i++) {
		if (fs.existsSync(process.cwd()+"/shared/temp/video"+i+".mp4")) {
			fs.unlinkSync(process.cwd()+"/shared/temp/video"+i+".mp4");
			if(debug)
				console.log(i + " Exists");
		}
	}
}
function pickSource(tools) {
	return tools[Math.floor(Math.random() * tools.length)] 
}

module.exports = go;