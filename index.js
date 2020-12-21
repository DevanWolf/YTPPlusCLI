if(!process.cwd().includes("YTPPlusCLI")) {
	process.chdir("YTPPlusCLI");
}
const chalk = require('chalk'),
	clear = require('clear'),
	figlet = require('figlet'),
	prompts = require("./libs/prompts"),
	fs = require('fs'),
	package = JSON.parse(fs.readFileSync("./package.json")),
	argv = require('minimist')(process.argv.slice(2)),
	generator = require("./libs/generator");
clear(); //clear screen
console.log(
	chalk.greenBright(
		figlet.textSync('ytp+ cli', { horizontalLayout: 'full' }) + "\n" + package.homepage + "\nThis software is licensed under the GNU General Public License Version 3.0."
	)
);
//errors and warnings
let plugins
if(!fs.existsSync(process.cwd()+"/plugins")) {
	console.log(chalk.redBright("No plugin directory found! Process halted.\nReplace the 'plugins' folder in "+process.cwd()));
	process.exit(1);
} else if(!fs.existsSync(process.cwd()+"/shared")) {
	console.log(chalk.yellow("No shared directory found!\nThe 'shared' directory has been created in "+process.cwd()));
	fs.mkdirSync(process.cwd()+"/shared")
}
if(!fs.existsSync(process.cwd()+"/shared/temp")) {
	fs.mkdirSync(process.cwd()+"/shared/temp");
}
const run = async () => {
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
	console.log(results)
	if(results.enabledplugins != null && results.enabledplugins != undefined && results.enabledplugins != "") {
		plugins = fs.readFileSync(results.enabledplugins).toString()
	} else {
		plugins = ""
	}
	console.log(chalk.blueBright("Plugins:\n--------\n")+chalk.cyanBright(plugins)+chalk.blueBright("\n--------"))
	results.plugins = plugins.split("\n")
	generator(results);
})
