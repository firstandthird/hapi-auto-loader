var Hoek = require('hoek');
var async = require('async');

var methodLoader = require('./lib/methodLoader');
var routeLoader = require('./lib/routeLoader');
var helperLoader = require('./lib/helperLoader');
var layoutLoader = require('./lib/layoutLoader');

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
  layouts: {
    path: 'views/layouts'
  }
};

exports.register = function(server, options, next) {
  
  var settings = Hoek.clone(options);
  settings = Hoek.applyToDefaults(defaults, settings);

  if (!settings.handlebars) {
    settings.handlebars = Handlebars;
  }

  this.server = server;
  this.settings = settings;

  server.expose('settings', this.settings);
  server.expose('handlebars', this.settings.Handlebars);
  server.app.handlebars = settings.handlebars;

  async.parallel([
    methodLoader.bind(this),
    routeLoader.bind(this),
    helperLoader.bind(this),
    layoutLoader.bind(this)
  ], function(err) {
    if (err) {
      return next(err)
    }

    next();
  });
};

exports.register.attributes = {
  pkg: require('./package.json')
};