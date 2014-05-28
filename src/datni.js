var express = require('express');
var app = express();

var providers = {};
function mount(path, provider) {
  providers[path] = provider;
}

function unmount(path) {
  providers[path] = null;
}

function read(path) {

}

function write(path) {

}

function execute(path) {

}

module.exports = {
  mount: mount,
  unmount: unmount,
  read: read,
  write: write,
  execute: execute
}
