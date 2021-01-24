/* Includes */
const fs = require("fs"),
	global = require("./global"),
	plugins = require("./plugins"),
	cliProgress = require('cli-progress'),
	child_process = require("child_process");

async function go(toolbox)
{
	let counter = 0;
	let ffmpeg;
	const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
	bar.start(toolbox.clips-1, 0);
	while(true) {
		suppressUnhandledRejections(startgeneration(toolbox, counter));
		bar.update(counter);
		if(counter >= toolbox.clips-1) {
			counter = -1;
			process.chdir(process.cwd()+"/shared/temp");
			for(var i = 0; i <= toolbox.clips-1; i++) {
				global.ffmpeg.runSync("-i video"+i+".mp4 -vcodec libx264 -preset ultrafast -acodec libmp3lame -ac 2 -f avi -y ivideo"+i+".avi"+(toolbox.debug ? "" : " -hide_banner -loglevel quiet"));
			}
			if(ffmpeg != undefined) child_process.execSync("START /wait taskkill /IM \"ffmpeg.exe\" /F");
			ffmpeg = global.ffmpeg.run("-re -fflags +igndts -i concat.txt -c copy -ac 2 -f flv "+toolbox.rtmpurl+(toolbox.debug ? "" : " -hide_banner -loglevel quiet"));
			process.chdir(process.cwd()+"/../..");
		}
		counter++;
	}
}

function suppressUnhandledRejections(p) {
	p.catch(() => {});
	return p;
}	

function startgeneration(toolbox, counter) {
	return new Promise((resolve, reject) => {
		if(toolbox.sequential) var sequential = -1; //start on -1 as it will be incremented
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
			var sourceToPick = inputfiles[global.randomInt(0, inputfiles.length-1)];
			var data = global.getVideoProbe(sourceToPick);
			var length = data.duration;
			var startOfClip = randomvar(0, length - toolbox.maxstream);
			var endOfClip = startOfClip + randomvar(toolbox.minstream, toolbox.maxstream);
			if(toolbox.debug) //Copied from YTP+ for redundancy
			{
				console.log("\nSource: "+sourceToPick);
				console.log("\nLength: "+length);
			}
			if (global.randomInt(0, 15) == 15 && toolbox.usetransitions==true) {
				if(toolbox.debug)
					console.log("\nTryina use a diff source");
				var transitions = fs.readFileSync(toolbox.transitions, {encoding:"utf-8"});
				global.copyVideo(pickSource(transitions.split("\n")), process.cwd()+"/shared/temp/video" + counter, [toolbox.width, toolbox.height], toolbox.fps, toolbox.debug);
			} else {
				global.snipVideo(sourceToPick, startOfClip, endOfClip, process.cwd()+"/shared/temp/video" + counter, [toolbox.width, toolbox.height], toolbox.fps, toolbox.debug);
			}
			//Add a random effect to the video
			let int;
			if(toolbox.sequential) {
				if(sequential == toolbox.plugins.length) sequential = -1; //prepare for addition below
				sequential++;
				int = sequential;
			} else
				int = (toolbox.plugintest ? 0 : global.randomInt(0, toolbox.plugins.length+5));
			if(int < toolbox.plugins.length && toolbox.plugins.length != 0) {
				if(toolbox.plugins[int] != "") {
					var effect = toolbox.plugins[int];
					var clipToWorkWith = process.cwd()+"/shared/temp/video" + counter + ".mp4";
					plugins[effect].plugin(clipToWorkWith, toolbox, process.cwd(), toolbox.debug);
				}
			}
			resolve();
		} catch (ex) {
			process.stdin.resume();
			if(!toolbox.silent) {
				console.log("\nAn error has occured.")
				console.log("\n"+ex)
			}
			reject();
		}
	});
}

function randomvar(min, max) {
	var finalVal = -1;
	while (finalVal<0) {
		var x = (Math.random() * ((max - min))) + min;
		finalVal=Math.round(x * 100.0) / 100.0; 
	}
	return finalVal;
}

function pickSource(tools) {
	return tools[Math.floor(Math.random() * tools.length)] 
}

module.exports = go;