"use strict";
/* Change directory to YTPPlusCLI if we're not in it already */
const argv = require('minimist')(process.argv.slice(2)), //Used elsewhere too
	cwd = (argv.cwd ? argv.cwd : process.cwd());
if(!cwd.includes("YTPPlusCLI")) {
	process.chdir(cwd + "/YTPPlusCLI");
}
/* Includes */
const fs = require('fs'),
	pkg = JSON.parse(fs.readFileSync("./package.json", {encoding:"utf-8"})),
	generator = require("./generator"),
	version = fs.readFileSync("version.txt", {encoding:"utf-8"}),
	plugins = (argv.plugintest ? [argv.plugintest] : (argv.plugins ? fs.readFileSync(argv.plugins, {encoding:"utf-8"}).split("\r\n") : fs.readdirSync("plugins"))),
	global = require("./global");
/* Single-use parameters */
if(argv.getplugins) {
	if(argv.pluginoutput) {
		fs.writeFileSync(argv.pluginoutput,plugins.join("\n"));
	} else {
		console.log(plugins.join("\n"));
	}
	process.exit(0);
} else if(argv.version) {
	console.log(version);
	process.exit(0);
}
/* Title */
if(!argv.silent)
	console.log("ytp+ cli\n" + pkg.homepage + " v" + version + "\nThis software is licensed under the GNU General Public License Version 3.0.");
/* Errors and warnings */
if(!fs.existsSync(process.cwd()+"/shared")) {
	console.log("No shared directory found!\nThe 'shared' directory has been created in "+process.cwd());
	fs.mkdirSync(process.cwd()+"/shared")
}
if(!fs.existsSync(process.cwd()+"/shared/temp")) {
	fs.mkdirSync(process.cwd()+"/shared/temp");
}
/* Launch generator.js */
if(argv.silent) {
	argv.debug = false
}
/* Merge defaults */
var results = global.defaults;
let key;
for(key in argv)
	results[key] = argv[key]; //merge

if(argv.debug) {
	results.debug = argv.debug
	console.log(results)
} else {
	results.debug = false
}

if(!argv.silent)
	console.log("Plugins:\n--------\n"+plugins.join("\n")+"\n--------\nStarting generation, progress cannot be shown due to the current branch.")
results.plugins = plugins
results.plugintest = argv.plugintest
generator(results);
