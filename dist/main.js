// Generated by CoffeeScript 1.6.2
(function() {
  var ProtoSock, client, server;

  ProtoSock = require('wearefractal-protosock');

  client = require('./Client');

  module.exports = {
    createClient: ProtoSock.createClientWrapper(client)
  };

  if (typeof window === "undefined" || window === null) {
    server = require('./Server');
    module.exports.createServer = ProtoSock.createServerWrapper(server);
  }

}).call(this);
