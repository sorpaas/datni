var path = require('./path');
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');

function Filesystem() {
  var providers = {};

  this.getProvider(dir) {
    var loc = path.normalize(dir);

    for(var provider_loc in providers) {
      if(loc.startsWith(provider_loc)) {
        return providers[provider_loc];
      }
    }

    return null;
  }

  this.getMountBase(dir) {
    var loc = path.normalize(dir);

    for(var provider_loc in providers) {
      if(loc.startsWith(provider_loc)) {
        return provider_loc;
      }
    }

    return null;
  }

  this.isMounted(dir) {
    return !!getProvider(dir);
  }

  this.mount(dir, provider) {
    if(isMounted(dir)) {
      throw new Error('The path is already mounted');
    }

    var loc = path.normalize(dir);
    providers[loc] = provider;
  }

  this.unmount(dir) {
    var loc = path.normalize(dir);

    for(var provider_loc in providers) {
      if(loc.startsWith(provider_loc)) {
        providers[provider_loc] = null;
      }
    }
  }

  this.read(dir) {
    if(!isMounted(dir)) {
      throw new Error('Cannot find the provider of ' + dir);
    }
    var loc = path.normalize(dir);

    var provider = getProvider(loc);
    var relativeDir = path.relative(getMountBase(loc), loc);

    return provider.read(relativeDir);
  }

  this.write(dir, content) {
    if(!isMounted(dir)) {
      throw new Error('Cannot find the provider of ' + dir);
    }
    var loc = path.normalize(dir);

    var provider = getProvider(loc);
    var relativeDir = path.relative(getMountBase(loc), loc);

    return provider.write(relativeDir, content);
  }

  this.execute(dir) {
    if(!isMounted(dir)) {
      throw new Error('Cannot find the provider of ' + dir);
    }
    var loc = path.normalize(dir);

    var provider = getProvider(loc);
    var relativeDir = path.relative(getMountBase(loc), loc);

    return provider.execute(relativeDir);
  }

  this.serve(port) {
    var app = express();

    // parse application/json and application/x-www-form-urlencoded
    app.use(bodyParser())

    // parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

    //Serve read
    app.get('*', function(req, res) {
      res.send(read(req.path));
    });

    //Serve write
    app.put('*', function(req, res) {
      write(req.path, req.body);
      res.status(201);
    });

    //Serve execute
    app.post('*', function(req, res) {
      res.send(execute(req.path));
    });
  }
}

module.exports = {
  createFilesystem: function() {
    return new Filesystem();
  }
}
