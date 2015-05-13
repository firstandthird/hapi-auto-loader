var Hapi = require('hapi');
var path = require('path');
var Handlebars = require('handlebars');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register({
  register: require('../'),
  options: {
  }
}, function (err) {
  if (err) {
    console.error('Failed to load a plugin:', err);
    return;
  }

  var viewConfig = {
    engines: {
      html: Handlebars
    },
    relativeTo: path.join(process.cwd(), 'example', 'views'),
    path: 'pages',
    isCached: true
  };

  server.views(viewConfig);

  //require('../')(server, {
    //cwd: path.join(process.cwd(), 'example'),
    //partials: {
      //path: 'views/modules'
    //},
    //routes: false
  //}, function(err) {
  server.plugins['hapi-auto-loader'].load({
    cwd: path.join(process.cwd(), 'example'),
    routes: {
      base: '/cats/',
      context: {
        catPic: 'http://placekitten.com/g/200/300'
      }
    },
  }, function() {
    server.start(function() {
      server.methods.folder.doSomething(function(err, result) {
        console.log('method result', result);
      });
      console.log('Server running at:', server.info.uri);
    });
  });

});
