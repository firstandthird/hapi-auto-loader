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
    path: 'routes'
  },
  helpers: {
    path: 'helpers'
  },
  partials: {
    path: 'partials'
  }
};

var loader = function(server, options, next) {
  
  var settings = Hoek.clone(options);
  settings = Hoek.applyToDefaults(defaults, settings);

  if (!settings.handlebars) {
    settings.handlebars = server.app.handlebars || Handlebars;
  }

  this.server = server;
  this.settings = settings;

  if (!server.app.autoLoaderInit) {
    server.expose('settings', this.settings);
    server.expose('handlebars', this.settings.Handlebars);
    server.app.handlebars = settings.handlebars;
    server.app.autoLoaderInit = true;
  }

  async.parallel([
    methodLoader.bind(this),
    routeLoader.bind(this),
    helperLoader.bind(this),
    partialLoader.bind(this)
  ], function(err) {
    if (err) {
      return next(err)
    }

    next();
  });
};

loader.register = loader;

loader.register.attributes = {
  pkg: require('./package.json')
};

module.exports = loader;