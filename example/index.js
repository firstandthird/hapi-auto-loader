var Hapi = require('hapi');
var path = require('path');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.register({
  register: require('../'),
  options: {
    cwd: path.join(process.cwd(), 'example')
  }
}, function (err) {
  if (err) {
    console.error('Failed to load a plugin:', err);
    return;
  }

  var viewConfig = {
    engines: {
      html: server.app.handlebars
    },
    relativeTo: path.join(process.cwd(), 'example', 'views'),
    path: 'pages',
    isCached: true
  };

  server.views(viewConfig);

  require('../')(server, {
    cwd: path.join(process.cwd(), 'example'),
    partials: {
      path: 'views/modules'
    },
    routes: false
  }, function(err) {
    console.log('auto-loaded again');

    server.start(function() {
      console.log('Server running at:', server.info.uri);
    });
  });
});