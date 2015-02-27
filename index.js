var Hoek = require('hoek');
var async = require('async');

var methodLoader = require('./lib/methodLoader');
var routeLoader = require('./lib/routeLoader');
var viewLoader = require('./lib/viewLoader');
var helperLoader = require('./lib/helperLoader');

var Handlebars = require('handlebars');
require('handlebars-layouts')(Handlebars);

var defaults = {
  cwd: process.cwd(),
  handlebars: Handlebars,
  methods: {
    path: 'methods'
  },
  routes: {
    path: 'routes'
  },
  views: {
    path: 'views',
    cached: true,
    pages: 'pages',
    partials: 'modules',
    layouts: [
      'layout'
    ]
  },
  helpers: {
    path: 'helpers'
  }
};

exports.register = function(server, options, next) {
  
  var settings = Hoek.clone(options);
  settings = Hoek.applyToDefaults(defaults, settings);

  this.server = server;
  this.settings = settings;

  server.expose('settings', this.settings);
  server.expose('handlebars', this.settings.Handlebars);

  async.parallel([
    methodLoader.bind(this),
    routeLoader.bind(this),
    viewLoader.bind(this),
    helperLoader.bind(this)
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