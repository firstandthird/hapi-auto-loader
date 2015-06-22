exports.apiHome = {
  method: 'GET',
  handler: function(request, reply) {
    reply({test: true});
  }
};


exports.api = {
  path: 'something',
  method: 'GET',
  handler: function(request, reply) {
    reply({test: true});
  }
};

exports.apiLogout = {
  path: '/logout',
  method: 'GET',
  handler: function(request, reply) {
    reply({test: true});
  }
};
