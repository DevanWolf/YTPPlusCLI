//unused right now
const fs = require('fs');
fs.readdirSync(process.cwd() + '/plugins/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
      exports[file] = require('../plugins/' + file);
  }
});
