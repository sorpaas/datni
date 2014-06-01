var path = require('./path');
var util = require('util');

function Filesystem() {
  this.providers = {};

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
}

module.exports = {
  createFilesystem: function() {
    return new Filesystem();
  }
}
