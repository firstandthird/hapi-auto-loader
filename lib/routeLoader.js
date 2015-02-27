var path = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports = function(next) {

  var self = this;
  var routePath = path.join(this.settings.cwd, this.settings.routes.path);

  fs.stat(routePath, function(err, stat) {
    
    if (err || !stat.isDirectory()) {
      return next();
    }

    require('require-all')({
      dirname: routePath,
      resolve: function(routeObj) {
        _.forIn(routeObj, function(route) {
          self.server.route(route);
        });
      }
    });

    next();

  });

};