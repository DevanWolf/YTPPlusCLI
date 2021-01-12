if(!process.cwd().includes("YTPPlusCLI")) {
	process.chdir("YTPPlusCLI");
}
const figlet = require('figlet'),
	prompts = require("./prompts"),
	fs = require('fs'),
	package = JSON.parse(fs.readFileSync("./package.json")),
	argv = require('minimist')(process.argv.slice(2)),
	generator = require("./generator"),
	version = fs.readFileSync("version.txt");
if(!argv.silent)
	console.log(figlet.textSync('ytp+ cli', { horizontalLayout: 'full' }) + "\n" + package.homepage + " v" + version + "\nThis software is licensed under the GNU General Public License Version 3.0.");
//errors and warnings
let plugins
if(!fs.existsSync(process.cwd()+"/plugins")) {
	console.log("No plugin directory found! Process halted.\nReplace the 'plugins' folder in "+process.cwd());
	process.exit(1);
} else if(!fs.existsSync(process.cwd()+"/shared")) {
	console.log("No shared directory found!\nThe 'shared' directory has been created in "+process.cwd());
	fs.mkdirSync(process.cwd()+"/shared")
}
if(!fs.existsSync(process.cwd()+"/shared/temp")) {
	fs.mkdirSync(process.cwd()+"/shared/temp");
}
const run = async () => {
	if(argv.silent)
		argv.skip = true;
	if(argv.skip != null) {
		return argv; //skip prompts
	} else {
		var results = await prompts.askYTP(argv);
		if(results.usetransitions == true) {
			var results2 = await prompts.askTransitions(argv);
			results.transitions = results2.transitions; //merging
		}
		return results;
	}
};
run().then((results) => {
	if(argv.debug != null || argv.debug != undefined) {
		results.debug = argv.debug
		console.log(results)
	} else {
		results.debug = false
	}
	plugins = fs.readdirSync("plugins")
	if(!argv.silent)
		console.log("Plugins:\n--------\n"+plugins+"\n--------")
	results.plugins = plugins
	generator(results);
})
