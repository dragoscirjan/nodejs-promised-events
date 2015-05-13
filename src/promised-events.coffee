###
  Promised Event Emitter
  @link      http://github.com/dragoscirjan/promised-events for the canonical source repository
  @link      https://github.com/dragoscirjan/promised-events/issues for issues and support
  @license   https://github.com/dragoscirjan/promised-events/blob/master/LICENSE
###

# http://code.tutsplus.com/tutorials/using-nodes-event-module--net-35941
# http://bahmutov.calepin.co/promisify-event-emitter.html

# https://quickleft.com/blog/creating-and-publishing-a-node-js-module/
# https://github.com/brentertz/scapegoat

###
  @var {Object}
  @class EventEmitter
###
EventEmitter = require('events').EventEmitter

###
  @var {Object}
  @class Q
###
Q = require 'q'

###
  @var Function
###
selfAddressed = require('self-addressed')

isFunction = (arg) ->
  typeof arg == 'function'

isNumber = (arg) ->
  typeof arg == 'number'

isObject = (arg) ->
  typeof arg == 'object' and arg != null

isUndefined = (arg) ->
  arg == undefined

###
  Promised Event Emitter
  based on an article written by Gleb Bahmutov
  @class PromisedEventEmitter
  @link https://github.com/Gozala/events
  @link https://github.com/bahmutov/self-addressed
  @link http://bahmutov.calepin.co/promisify-event-emitter.html
  @license MIT
###
class SelfAdressedEventEmitter extends EventEmitter
  constructor: () ->
    throw new Error('This class is in development still')

  emit: (name, data) ->
    console.log 'emiting', name, data
    # override EventEmitter.prototype.emit function
    mailman = (address, envelope) ->
      SelfAdressedEventEmitter.__super__.emit.apply address, [name, envelope]
    # return a promise
    selfAddressed mailman, @, data

#  on: (name, func) ->
#    onSelfAddressedEnvelope = (envelope) ->
#      # we could get data from envelope if needed
#      result = () ->
#      selfAddressed envelope, result
#      # somehow deliver the envelope back to the caller .emit
#    PromisedEventEmitter.__super__.on.call @, name, onSelfAddressedEnvelope
  on: (name, func) ->
    console.log 'add onSelfAddressedEnvelope'
    onSelfAddressedEnvelope = (envelope) ->
      console.log 'exec onSelfAddressedEnvelope'
      if selfAddressed.is envelope
        # we could get data from envelope if needed
        result = () ->
        selfAddressed envelope, result
        # somehow deliver the envelope back to the caller .emit
#        envelope.replies = 1
#        selfAddressed envelope
    SelfAdressedEventEmitter.__super__.on.apply @, [name, onSelfAddressedEnvelope]

###
  Promised Event Emitter
  based on the Q library written by Kristopher Michael Kowal
  @link https://github.com/Gozala/events
  @link https://github.com/kriskowal/q
  @license GPL v3
###
class QEventEmitter extends EventEmitter

  ###
    Override of EventEmitter emit method, in order to promisify any function/method
    called by an event.
    @see EventEmitter::emit()
    @return {Object} Promise
  ###
  emit: (type) ->
    defered = Q.defer()
    ### @see EventEmitter::emit() code ###
    er = undefined
    handler = undefined
    len = undefined
    args = undefined
    i = undefined
    listeners = undefined

    if !@_events
      @_events = {}
    # If there is no 'error' event listener then throw.
    if type == 'error'
      if !@_events.error or isObject(@_events.error) and !@_events.error.length
        er = arguments[1]
        if er instanceof Error
          throw er
        # Unhandled 'error' event
        throw TypeError('Uncaught, unspecified "error" event.')

    handler = @_events[type]
    if isUndefined(handler)
      return defered.reject new Error 'Undefined handler for this event'
    if isFunction(handler)
      args = if arguments.length > 0 then Array::slice.call(arguments, 1) else []
      args.unshift(handler)
      Q.fcall.apply(@, args).then (val) ->
        defered.resolve val
#      handler.apply this, args
    else if isObject(handler)
      args = Array::slice.call(arguments, 1)
      args.unshift null
      listeners = handler.slice()
      len = listeners.length
      results = []
      success = (val) ->
        results.push(val)
        if results.length == listeners.length
          defered.resolve results
      i = 0
      while i < len
        args.shift()
        args.unshift(listeners[i])
        Q.fcall.apply(@, args).then success, (err) ->
          defered.reject err
        # listeners[i].apply this, args
        i++
    defered.promise

module.exports = {
  SAPromisedEventEmitter: SelfAdressedEventEmitter
  QPromisedEventEmitter: QEventEmitter
  PromisedEventEmitter: QEventEmitter
}