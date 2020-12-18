//unused right now
const fs = require('fs');
fs.readdirSync(__dirname + '/plugins/').forEach(function(file) { //add plugins to global
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
      var name = file.replace('.js', '');
      exports[name] = require('./plugins/' + file);
  }
});
