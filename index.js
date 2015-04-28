var Hoek = require('hoek');
var async = require('async');

var methodLoader = require('./lib/methodLoader');
var routeLoader = require('./lib/routeLoader');
var helperLoader = require('./lib/helperLoader');
var partialLoader = require('./lib/partialLoader');

var Handlebars = require('handlebars');
require('handlebars-layouts')(Handlebars);

var defaults = {
  cwd: process.cwd(),
  methods: {
    path: 'methods'
  },
  routes: {
    path: 'routes',
    base: '/',
    context: {}
  },
  helpers: {
    path: 'helpers'
  },
  partials: {
    path: 'partials'
  }
};

exports.register = function(server, foo, next) {

  server.expose('load', function(options, done) {

    var settings = Hoek.clone(options);
    settings = Hoek.applyToDefaults(defaults, settings);

    if (!settings.handlebars) {
      settings.handlebars = server.app.handlebars || Handlebars;
    }

    var self = {
      server: server,
      settings: settings
    };

    server.expose('settings', self.settings);
    server.expose('handlebars', self.settings.Handlebars);
    server.app.handlebars = settings.handlebars;

    async.parallel([
      methodLoader.bind(self),
      routeLoader.bind(self),
      helperLoader.bind(self),
      partialLoader.bind(self)
    ], function(err) {
      if (err) {
        return done(err);
      }

      done();
    });

  });

  next();

};

exports.register.attributes = {
  pkg: require('./package.json')
};
