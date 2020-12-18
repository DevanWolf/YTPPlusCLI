const chalk = require('chalk'),
	clear = require('clear'),
	figlet = require('figlet'),
	prompts = require("./libs/prompts"),
	fs = require('fs'),
	package = JSON.parse(fs.readFileSync("./package.json")),
	argv = require('minimist')(process.argv.slice(2));
clear(); //clear screen
console.log(
	chalk.greenBright(
		figlet.textSync('ytp+ cli', { horizontalLayout: 'full' }) + "\n" + package.homepage + "\nThis software is licensed under the GNU General Public License Version 3.0."
	)
);
//errors and warnings
if(!fs.existsSync(process.cwd()+"/plugins")) {
	console.log(chalk.redBright("No plugin directory found! Process halted.\nReplace the 'plugins' folder in "+process.cwd()));
	process.exit(1);
} else if(!fs.existsSync(process.cwd()+"/enabledplugins.txt")) {
	console.log(chalk.yellow("enabledplugins.txt was not found, all plugins have been enabled.\nReplace this file in "+process.cwd()+" or use a frontend to avoid this warning in the future."));
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
	console.log(results);
})
