var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = function(next) {

  if (!this.settings.helpers) {
    return next();
  }

  var self = this;
  var helperPath = path.join(this.settings.cwd, this.settings.helpers.path);

  fs.stat(helperPath, function(err, stat) {

    if (err || !stat.isDirectory()) {
      return next();
    }

    var helpers = require('require-all')(helperPath);

    _.forIn(helpers, function(value, key) {
      self.settings.handlebars.registerHelper(key, function() {
        this._server = self.server;
        value.apply(this, arguments);
      });
    });

    next();

  });

};
