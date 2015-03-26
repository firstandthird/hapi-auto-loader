exports.home = {
  path: '/',
  method: 'GET',
  config: {
    pre: [
      {
        assign: 'time',
        method: 'getTime()'
      }
    ]
  },
  handler: function(request, reply) {
    reply.view('home', {
      time: request.pre.time
    });
  }
};
