var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');

module.exports = function(next) {

  if (!this.settings.partials) {
    return next();
  }

  var self = this;
  var partialsPath = path.join(this.settings.cwd, this.settings.partials.path);

  fs.stat(partialsPath, function(err, stat) {
    
    if (err || !stat.isDirectory()) {
      return next();
    }

    glob('**/*.html', {
      cwd: partialsPath
    }, function(err, files) {
      if (err) {
        return next(err);
      }

      _.each(files, function(file) {
        self.settings.handlebars.registerPartial(file.replace('.html', ''), fs.readFileSync(path.join(partialsPath, file), 'utf8'));
      });

      next();
    });

  });

};