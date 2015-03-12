var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var Hoek = require('hoek');

module.exports = function(next) {

  if (!this.settings.routes) {
    return next();
  }

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
          route.path = path.join(self.settings.routes.base, route.path);
          self.server.route(route);
        });
      }
    });

    self.server.ext('onPreResponse', function(request, reply) {
      var response = request.response;

      if (response.variety === 'view') {

        var context = Hoek.clone(response.source.context || {});
        response.source.context = Hoek.applyToDefaults(self.settings.routes.context, context);

      }

      reply(response);
    });

    next();

  });

};