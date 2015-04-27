var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = function(next) {

  if (!this.settings.methods) {
    return next();
  }

  var self = this;
  var methodPath = path.join(this.settings.cwd, this.settings.methods.path);

  var addMethod = function(folder, key, value) {
    key = _.camelCase(key);
    //check for method already loaded
    if ((folder && typeof self.server.methods[folder] != 'undefined' && typeof self.server.methods[folder][key] != 'undefined') || typeof self.server.methods[key] !== 'undefined') {
      return;
    }
    key = (folder) ? folder+'.'+key : key;
    self.server.method(key, value.method.bind(self.server), value.options || {});
  };

  fs.stat(methodPath, function(err, stat) {

    if (err || !stat.isDirectory()) {
      return next();
    }

    var methods = require('require-all')(methodPath);

    _.forIn(methods, function(value, key) {
      //check if folder
      if (typeof value == 'object' && !value.method) { //assume folder
        _.forIn(value, function(v, k) {
          addMethod(key, k, v);
        });
      } else {
        addMethod(false, key, value);
      }
    });

    next();

  });

};
