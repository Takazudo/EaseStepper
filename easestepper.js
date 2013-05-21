/*! EaseStepper (https://github.com/Takazudo/EaseStepper)
 * lastupdate: 2013-05-21
 * version: 1.1.0
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

    function EaseStepper(options) {
      this.options = options;
      this._tweakOptions();
      this._whileEasing = false;
      this._stopRequested = false;
    }

    EaseStepper.prototype._tweakOptions = function() {
      var o;
      o = this.options;
      if (!o.interval) {
        o.interval = 13;
      }
      if (o.done) {
        this.done(o.done);
      }
      if (!o.beginningValue) {
        o.beginningValue = 0;
      }
      if (!o.valueInChange) {
        o.valueInChange = o.endValue - o.beginningValue;
      }
      return this;
    };

    EaseStepper.prototype._triggerEvent = function(name, elapsedTimeRate, valueChangeRate, value) {
      this._currentData = {
        elapsedTimeRate: elapsedTimeRate,
        valueChangeRate: valueChangeRate,
        value: value + this.options.beginningValue
      };
      this.trigger(name, this._currentData);
      return this;
    };

    EaseStepper.prototype.start = function() {
      var currentVal, elapsedTime, o, tick,
        _this = this;
      o = this.options;
      this._triggerEvent('start', 0, 0, 0);
      elapsedTime = 0;
      currentVal = 0;
      this._whileEasing = true;
      this._timerId = null;
      tick = function() {
        var elapsedTimeRate, valueChangeRate;
        if (_this._stopRequested === true) {
          return;
        }
        if (elapsedTime >= o.duration) {
          _this._whileEasing = false;
          _this._triggerEvent('end', 1, 1, o.valueInChange);
          _this._clearTimer();
          return;
        }
        elapsedTimeRate = elapsedTime / o.duration;
        valueChangeRate = o.easing(elapsedTimeRate, elapsedTime, 0, 1, o.duration);
        currentVal = o.valueInChange * valueChangeRate;
        _this._triggerEvent('step', elapsedTimeRate, valueChangeRate, currentVal);
        return elapsedTime += o.interval;
      };
      this._timerId = setInterval(tick, o.interval);
      return this;
    };

    EaseStepper.prototype._clearTimer = function() {
      if (this._timerId) {
        clearInterval(this._timerId);
        this._timerId = null;
      }
      return this;
    };

    EaseStepper.prototype.stop = function() {
      if (this._whileEasing === false) {
        return false;
      }
      this._clearTimer();
      this._stopRequested = true;
      this._triggerEvent('stop', this._currentData);
      return this;
    };

    EaseStepper.prototype.done = function(fn) {
      var _this = this;
      this.on('end', function() {
        return fn(_this);
      });
      return this;
    };

    return EaseStepper;

  })(ns.Event);

  window.EaseStepperNs = ns;

  window.EaseStepper = EaseStepper;

}).call(this);
