var path = require('path');
var fs = require('fs');
var async = require('async');

module.exports = function(next) {

  var self = this;
  var viewPath = path.join(this.settings.cwd, this.settings.views.path);

  fs.stat(viewPath, function(err, stat) {
    
    if (err || !stat.isDirectory()) {
      return next();
    }

    var viewConfig = {
      engines: {
        html: self.settings.handlebars
      },
      path: path.join(viewPath, self.settings.views.pages),
      isCached: self.settings.views.cached
    };

    var partialsPath = path.join(viewPath, self.settings.views.partials);
    async.parallel([
      async.apply(fs.stat, partialsPath)
    ], function(err, stats) {
      
      if (!err && stat.isDirectory()) {
        viewConfig.partialsPath = partialsPath;
      }

      self.server.views(viewConfig);

      var layouts = self.settings.views.layouts;
      async.each(layouts, function(layout, done) {
        
        var layoutPath = path.resolve(viewPath, layout + '.html');
        fs.readFile(layoutPath, { encoding: 'utf8' }, function(err, data) {
          
          if (err) {
            return done();
          }

          self.settings.handlebars.registerPartial(layout, data);

          done();
        });

      }, function(err) {
        next(err);
      });
    });

  });

};