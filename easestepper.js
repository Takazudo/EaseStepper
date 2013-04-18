/*! EaseStepper (https://github.com/Takazudo/EaseStepper)
 * lastupdate: 2013-04-18
 * version: 1.0.0
 * author: 'Takazudo' Takeshi Takatsudo <takazudo@gmail.com>
 * License: MIT */
(function() {
  var EaseStepper, ns,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ns = {};

  ns.Event = (function() {

    function Event() {}

    Event.prototype.on = function(ev, callback) {
      var evs, name, _base, _i, _len;
      if (this._callbacks == null) {
        this._callbacks = {};
      }
      evs = ev.split(' ');
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        (_base = this._callbacks)[name] || (_base[name] = []);
        this._callbacks[name].push(callback);
      }
      return this;
    };

    Event.prototype.once = function(ev, callback) {
      this.on(ev, function() {
        this.off(ev, arguments.callee);
        return callback.apply(this, arguments);
      });
      return this;
    };

    Event.prototype.trigger = function() {
      var args, callback, ev, list, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ev = args.shift();
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) {
        return;
      }
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        callback = list[_i];
        if (callback.apply(this, args) === false) {
          break;
        }
      }
      return this;
    };

    Event.prototype.off = function(ev, callback) {
      var cb, i, list, _i, _len, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) {
        return this;
      }
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        cb = list[i];
        if (!(cb === callback)) {
          continue;
        }
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    };

    return Event;

  })();

  EaseStepper = (function(_super) {

    __extends(EaseStepper, _super);

    function EaseStepper() {
      console.log('foo');
    }

    return EaseStepper;

  })(ns.Event);

  window.EaseStepperNs = ns;

  window.EaseStepper = EaseStepper;

}).call(this);
