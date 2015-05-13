
/*
  Promised Event Emitter
  @link      http://github.com/dragoscirjan/promised-events for the canonical source repository
  @link      https://github.com/dragoscirjan/promised-events/issues for issues and support
  @license   https://github.com/dragoscirjan/promised-events/blob/master/LICENSE
 */


/*
  @var {Object}
  @class EventEmitter
 */

(function() {
  var EventEmitter, Q, QEventEmitter, SelfAdressedEventEmitter, isFunction, isNumber, isObject, isUndefined, selfAddressed,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = require('events').EventEmitter;


  /*
    @var {Object}
    @class Q
   */

  Q = require('q');


  /*
    @var Function
   */

  selfAddressed = require('self-addressed');

  isFunction = function(arg) {
    return typeof arg === 'function';
  };

  isNumber = function(arg) {
    return typeof arg === 'number';
  };

  isObject = function(arg) {
    return typeof arg === 'object' && arg !== null;
  };

  isUndefined = function(arg) {
    return arg === void 0;
  };


  /*
    Promised Event Emitter
    based on an article written by Gleb Bahmutov
    @class PromisedEventEmitter
    @link https://github.com/Gozala/events
    @link https://github.com/bahmutov/self-addressed
    @link http://bahmutov.calepin.co/promisify-event-emitter.html
    @license MIT
   */

  SelfAdressedEventEmitter = (function(superClass) {
    extend(SelfAdressedEventEmitter, superClass);

    function SelfAdressedEventEmitter() {
      throw new Error('This class is in development still');
    }

    SelfAdressedEventEmitter.prototype.emit = function(name, data) {
      var mailman;
      console.log('emiting', name, data);
      mailman = function(address, envelope) {
        return SelfAdressedEventEmitter.__super__.emit.apply(address, [name, envelope]);
      };
      return selfAddressed(mailman, this, data);
    };

    SelfAdressedEventEmitter.prototype.on = function(name, func) {
      var onSelfAddressedEnvelope;
      console.log('add onSelfAddressedEnvelope');
      onSelfAddressedEnvelope = function(envelope) {
        var result;
        console.log('exec onSelfAddressedEnvelope');
        if (selfAddressed.is(envelope)) {
          result = function() {};
          return selfAddressed(envelope, result);
        }
      };
      return SelfAdressedEventEmitter.__super__.on.apply(this, [name, onSelfAddressedEnvelope]);
    };

    return SelfAdressedEventEmitter;

  })(EventEmitter);


  /*
    Promised Event Emitter
    based on the Q library written by Kristopher Michael Kowal
    @link https://github.com/Gozala/events
    @link https://github.com/kriskowal/q
    @license GPL v3
   */

  QEventEmitter = (function(superClass) {
    extend(QEventEmitter, superClass);

    function QEventEmitter() {
      return QEventEmitter.__super__.constructor.apply(this, arguments);
    }


    /*
      Override of EventEmitter emit method, in order to promisify any function/method
      called by an event.
      @see EventEmitter::emit()
      @return {Object} Promise
     */

    QEventEmitter.prototype.emit = function(type) {
      var args, defered, er, fail, handler, i, j, len, len1, listener, listeners, results, success;
      defered = Q.defer();

      /* @see EventEmitter::emit() code */
      er = void 0;
      handler = void 0;
      len = void 0;
      args = void 0;
      i = void 0;
      listeners = void 0;
      if (!this._events) {
        this._events = {};
      }
      if (type === 'error') {
        if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
          er = arguments[1];
          if (er instanceof Error) {
            throw er;
          }
          throw TypeError('Uncaught, unspecified "error" event.');
        }
      }
      handler = this._events[type];
      if (isUndefined(handler)) {
        return defered.reject(new Error('Undefined handler for this event'));
      }
      if (isFunction(handler)) {
        args = arguments.length > 0 ? Array.prototype.slice.call(arguments, 1) : [];
        args.unshift(handler);
        Q.fcall.apply(this, args).then(function(val) {
          return defered.resolve(val);
        });
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        args.unshift(null);
        listeners = handler.slice();
        len = listeners.length;
        results = [];
        success = function(val) {
          results.push(val);
          if (results.length === listeners.length) {
            return defered.resolve(results);
          }
        };
        i = 0;
        for (j = 0, len1 = listeners.length; j < len1; j++) {
          listener = listeners[j];
          args.shift();
          args.unshift(listener);
          fail = false;
          Q.fcall.apply(this, args).then(success, function(err) {
            fail = true;
            return defered.reject(err);
          });
          if (fail) {
            break;
          }
          i++;
        }
      }
      return defered.promise;
    };

    return QEventEmitter;

  })(EventEmitter);

  module.exports = {
    SAPromisedEventEmitter: SelfAdressedEventEmitter,
    QPromisedEventEmitter: QEventEmitter,
    PromisedEventEmitter: QEventEmitter
  };

}).call(this);
