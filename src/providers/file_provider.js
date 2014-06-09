var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

module.exports = function(physicalPath) {
  if(!fs.existsSync(physicalPath)) {
    throw 'physicalPath must exist in this file system.';
  }

  return {
    read: function(path) {
      return fs.readFileSync(path.join(physicalPath, path), {
        encoding: "utf-8"
      });
    },

    write: function(path, data) {
      fs.writeFileSync(path.join(physicalPath, path), data, {});
      return true;
    },

    execute: function(path) {
      var command = spawn(path.join(physicalPath, path), []);
      var result = "";
      var exited = false;

      command.stdout.on('data', function(data) {
        result += data;
      });

      command.on('close', function(code){
        exited = true;
      })

      while(!exited) {} //Wait until the subprocess is exited.

      return result;
    }
  }
}
