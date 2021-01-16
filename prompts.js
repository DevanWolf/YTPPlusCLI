const inquirer = require('inquirer'),
  fs = require("fs"),
  path = require("path"),
  global = require("./global");

module.exports = {
  askYTP: (argv) => {
	const questions = [
		{
			name: 'input',
			type: 'input',
			message: 'Enter the input *.txt file location:',
			default: argv.input || global.defaults.input,
			validate: function( value ) {
				if (value.length) {
					if(fs.existsSync(value)) {
						return true;
					} else {
						return 'The specified file does not exist, please enter a valid file.';
					}
				} else {
					return 'Please enter the input *.txt file location. It would contain the paths to mp4 videos separated by newlines.';
				}
			}
		},
		{
			name: 'output',
			type: 'input',
			message: 'Enter the output *.mp4 file location:',
			default: argv.output || global.defaults.output,
			validate: function( value ) {
				if (value.length) {
					if(fs.existsSync(path.dirname(value))) {
						return true;
					} else {
						return 'The specified directory does not exist, please enter a valid directory.';
					}
				} else {
					return 'Please enter the output *.mp4 file location. This is where the rendered video would be stored.';
				}
			}
		},
		{
			name: 'clips',
			type: 'number',
			default: argv.clips || global.defaults.clips,
			message: 'Enter the clip count:'
		},
		{
			name: 'minstream',
			type: 'number',
			default: argv.minstream || global.defaults.minstream,
			message: 'Enter the minimum stream duration:'
		},
		{
			name: 'maxstream',
			type: 'number',
			default: argv.maxstream || global.defaults.maxstream,
			message: 'Enter the maximum stream duration:'
		},
		{
			name: 'width',
			type: 'number',
			default: argv.width || global.defaults.width,
			message: 'Enter the video width:'
		},
		{
			name: 'height',
			type: 'number',
			default: argv.height || global.defaults.height,
			message: 'Enter the video height:'
		},
		{
			name: 'fps',
			type: 'number',
			default: argv.fps || global.defaults.fps,
			message: 'Enter the video FPS:'
		},
		{
			name: 'usetransitions',
			type: 'confirm',
			default: argv.usetransitions || global.defaults.usetransitions,
			message: 'Use transition clips at random?'
		}
	];
	return inquirer.prompt(questions);
  },
  askTransitions: (argv) => {
	const questions = [
	  {
		name: 'transitions',
		type: 'input',
		message: 'Enter the transitions *.txt file location:',
		default: argv.transitions || global.defaults.transitions,
		validate: function( value ) {
		  if (value.length) {
			if(fs.existsSync(value)) {
			  return true;
			} else {
			  return 'The specified file does not exist, please enter a valid file.';
			}
		  } else {
			return 'Please enter the transitions *.txt file location. It would contain the paths to mp4 videos separated by newlines for use in transitions.';
		  }
		}
	  }
	];
	return inquirer.prompt(questions);
  }
};