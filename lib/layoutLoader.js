var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');

module.exports = function(next) {

  var self = this;
  var layoutPath = path.join(this.settings.cwd, this.settings.layouts.path);

  fs.stat(layoutPath, function(err, stat) {
    
    if (err || !stat.isDirectory()) {
      return next();
    }

    glob('**/*.html', {
      cwd: layoutPath
    }, function(err, files) {
      if (err) {
        return next(err);
      }

      _.each(files, function(file) {
        self.settings.handlebars.registerPartial(file.replace('.html', ''), fs.readFileSync(path.join(layoutPath, file), 'utf8'));
      });

      next();
    });

  });

};