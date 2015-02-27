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

  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });
});