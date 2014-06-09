var fs = require('fs');
var path = require('../path');

module.exports = function(physicalPath) {
  var rawData = JSON.parse(fs.readFileSync(physicalPath, {encoding: 'utf8'}));

  function read(path) {
    var routes = path.normalize(path).split('/');
    var currentObj = rawData;
    for(var i in routes) {
      currentObj = currentObj[routes[i]];
    }
    return currentObj;
  }

  function write(path, data) {
    var routes = path.normalize(path).split('/');
    var currentObj = rawData;
    for(var i in routes) {
      if(routes[i] == routes.length - 1) {
        currentObj[routes[i]] = data;
      } else {
        currentObj = currentObj[routes[i]];
      }
    }
    fs.writeFileSync(path, rawData, {});
    return true;
  }

  function execute(path) {
    return read(path)();
  }

  return {
    read: read,
    write: write,
    execute: execute
  }
}
