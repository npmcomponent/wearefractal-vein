// Generated by CoffeeScript 1.6.2
(function() {
  var Namespace, async, basename, extname, join, readdirSync, _ref;

  readdirSync = require('fs').readdirSync;

  _ref = require('path'), join = _ref.join, basename = _ref.basename, extname = _ref.extname;

  async = require('async');

  Namespace = (function() {
    function Namespace(_name) {
      this._name = _name;
      this._services = {};
      this._stack = [];
    }

    Namespace.prototype.add = function(name, fn) {
      this._services[name] = fn;
      return this;
    };

    Namespace.prototype.remove = function(name) {
      delete this._services[name];
      return this;
    };

    Namespace.prototype.addFolder = function(folder) {
      var ext, file, service, serviceName, _i, _len, _ref1;

      _ref1 = readdirSync(folder);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        file = _ref1[_i];
        ext = extname(file);
        serviceName = basename(file, ext);
        if (require.extensions[ext] != null) {
          service = require(join(folder, file));
          this.add(serviceName, service);
        }
      }
      return this;
    };

    Namespace.prototype.use = function(fn) {
      this._stack.push(fn);
      return this;
    };

    Namespace.prototype._middle = function(msg, res, cb) {
      var run,
        _this = this;

      if (this._stack.length === 0) {
        return cb();
      }
      run = function(middle, done) {
        return middle(msg, res, done);
      };
      async.forEachSeries(this._stack, run, cb);
    };

    return Namespace;

  })();

  module.exports = Namespace;

}).call(this);
