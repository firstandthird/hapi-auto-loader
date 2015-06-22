var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var Hoek = require('hoek');
var glob = require('glob');

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

    glob('**/*.js', {
      cwd: routePath
    }, function(err, files) {
      if (err) {
        return next(err);
      }

      _.each(files, function(file) {
        var segment = file.replace(routePath, '').split(path.sep);
        segment.pop();
        segment = segment.join('/');

        var routeObj = require(path.join(routePath, file));

        _.forIn(routeObj, function(route) {
          var tmpPath = route.path || '';

          route.path = _.trimRight(self.settings.routes.base, '/');

          if (_.startsWith(tmpPath, '/')) {
            route.path += tmpPath;
          } else {
            route.path += '/' + segment + '/' + _.trimLeft(tmpPath, '/');
          }

          self.server.route(route);
        });
      });

      next();
    });

    self.server.ext('onPreResponse', function(request, reply) {
      var response = request.response;

      if (response.variety === 'view') {

        var context = Hoek.clone(response.source.context || {});
        response.source.context = Hoek.applyToDefaults(self.settings.routes.context, context);

      }

      reply.continue();
    });
  });

};
