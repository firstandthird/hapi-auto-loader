var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = function(next) {

  if (!this.settings.methods) {
    return next();
  }

  var self = this;
  var methodPath = path.join(this.settings.cwd, this.settings.methods.path);

  fs.stat(methodPath, function(err, stat) {
    
    if (err || !stat.isDirectory()) {
      return next();
    }

    var methods = require('require-all')(methodPath);

    _.forIn(methods, function(value, key) {

      if (typeof self.server.methods[key] !== 'undefined') {
        return;
      }
      
      self.server.method(key, value.method.bind(self.server), value.options || {});
    });

    next();

  });

};