const inquirer = require('inquirer'),
  fs = require("fs"),
  path = require("path");

module.exports = {
  askYTP: (argv) => {
    const questions = [
      {
        name: 'enabledplugins',
        type: 'input',
        message: 'Enter the enabled plugins *.txt file location:',
        default: argv.input || "enabledplugins.txt",
        validate: function( value ) {
          if (value.length) {
            if(fs.existsSync(value)) {
              return true;
            } else {
              return 'The specified file does not exist, please enter a valid file.';
            }
          } else {
            return 'Please enter the enabled plugins *.txt file location. It would contain the names of plugins with js extensions separated by newlines.';
          }
        }
      },
      {
        name: 'input',
        type: 'input',
        message: 'Enter the input *.txt file location:',
        default: argv.input || "videos.txt",
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
        default: argv.output || "output.mp4",
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
        default: argv.clips || 20,
        message: 'Enter the clip count:'
      },
      {
        name: 'minstream',
        type: 'number',
        default: argv.minstream || 0.2,
        message: 'Enter the minimum stream duration:'
      },
      {
        name: 'maxstream',
        type: 'number',
        default: argv.maxstream || 0.4,
        message: 'Enter the maximum stream duration:'
      },
      {
        name: 'width',
        type: 'number',
        default: argv.width || 640,
        message: 'Enter the video width:'
      },
      {
        name: 'height',
        type: 'number',
        default: argv.height || 480,
        message: 'Enter the video height:'
      },
      {
        name: 'fps',
        type: 'number',
        default: argv.fps || 30,
        message: 'Enter the video FPS:'
      },
      {
        name: 'usetransitions',
        type: 'confirm',
        default: argv.usetransitions || false,
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
        default: argv.transitions || "transitions.txt",
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