// Generated by CoffeeScript 1.6.2
(function() {
  var ClientNamespace, client, getId,
    _this = this,
    __slice = [].slice;

  getId = function() {
    var rand;

    rand = function() {
      return (((1 + Math.random()) * 0x10000000) | 0).toString(16);
    };
    return rand() + rand() + rand();
  };

  ClientNamespace = (function() {
    function ClientNamespace(_socket, _name) {
      this._socket = _socket;
      this._name = _name;
      this._services = [];
      this._callbacks = {};
    }

    ClientNamespace.prototype.add = function(svcs) {
      var service, _i, _len;

      for (_i = 0, _len = svcs.length; _i < _len; _i++) {
        service = svcs[_i];
        this._services = svcs;
        this[service] = this._getSender(service);
      }
      return this;
    };

    ClientNamespace.prototype._getSender = function(service) {
      var _this = this;

      return function() {
        var args, cb, id, _i;

        args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
        id = getId();
        if (typeof cb === 'function') {
          _this._callbacks[id] = cb;
        } else {
          args.push(cb);
        }
        return _this._socket.write({
          type: 'request',
          id: id,
          ns: _this._name,
          service: service,
          args: args
        });
      };
    };

    return ClientNamespace;

  })();

  client = {
    options: {
      namespace: 'Vein',
      resource: 'default'
    },
    start: function() {
      return this.namespaces = {};
    },
    ready: function(fn) {
      if (this.synced) {
        return fn(this.ns('main')._services, this.namespaces);
      }
      return this.once('ready', fn);
    },
    ns: function(name) {
      return this.namespaces[name];
    },
    validate: function(socket, msg, done) {
      if (typeof msg !== 'object') {
        return done(false);
      }
      if (typeof msg.type !== 'string') {
        return done(false);
      }
      if (msg.type === 'response') {
        if (typeof msg.id !== 'string') {
          return done(false);
        }
        if (typeof msg.ns !== 'string') {
          return done(false);
        }
        if (this.ns(msg.ns) == null) {
          return done(false);
        }
        if (typeof msg.service !== 'string') {
          return done(false);
        }
        if (typeof this.ns(msg.ns)._callbacks[msg.id] !== 'function') {
          return done(false);
        }
        if (!Array.isArray(msg.args)) {
          return done(false);
        }
      } else if (msg.type === 'services') {
        if (typeof msg.args !== 'object') {
          return done(false);
        }
      } else {
        return done(false);
      }
      return done(true);
    },
    error: function(socket, err) {
      return this.emit('error', err, socket);
    },
    message: function(socket, msg) {
      var k, v, _i, _len, _ref, _ref1, _ref2;

      if (msg.type === 'response') {
        (_ref = this.ns(msg.ns)._callbacks)[msg.id].apply(_ref, msg.args);
        return delete this.ns(msg.ns)._callbacks[msg.id];
      } else if (msg.type === 'services') {
        _ref1 = msg.args;
        for (k in _ref1) {
          v = _ref1[k];
          if (this.namespaces[k]) {
            this.namespaces[k].add(v);
          } else {
            this.namespaces[k] = new ClientNamespace(socket, k);
            this.namespaces[k].add(v);
          }
        }
        _ref2 = msg.args.main;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          k = _ref2[_i];
          this[k] = this.ns('main')[k];
        }
        this.synced = true;
        return this.emit('ready', this.ns('main')._services, this.namespaces);
      }
    }
  };

  module.exports = client;

}).call(this);
