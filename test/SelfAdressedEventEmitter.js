///**
// * Created by dragosc on 09.05.2015.
// */
//
//var assert = require("assert")
//
////var em = new (require('../index').PromisedEventEmitter)
//var events = require('events');
//var selfAddressed = require('self-addressed');
//var eventEmitter = new events.EventEmitter()
//var fs = require('fs')
//var Q = require('q')
//
//describe('Array', function(){
//    describe('#indexOf()', function(){
//        it('should return -1 when the value is not present', function(){
//            assert.equal(-1, [1,2,3].indexOf(5));
//            assert.equal(-1, [1,2,3].indexOf(0));
//
//            var _emit = events.EventEmitter.prototype.emit;
//            eventEmitter.emit = function (name, data) {
//                //function mailman(address, envelope) {
//                //    return _emit.apply(address, [name, envelope]);
//                //}
//                var result = _emit.apply(this, [name, envelope])
//                function mailman(address, envelope) {
//                    return result;
//                }
//                return selfAddressed(mailman, this, data); // returns a promise
//            };
//
//            var _on = events.EventEmitter.prototype.on;
//            eventEmitter.on = function (name, fn) {
//                function onSelfAddressedEnvelope(envelope) {
//                    if (selfAddressed.is(envelope)) {
//                        var result = fn();
//                        selfAddressed(envelope, result);
//                        // there is nowhere to send the response envelope
//                        // event emitters are unidirectional.
//                        // so open the envelope right away!
//                        envelope.replies = 1;
//                        selfAddressed(envelope); // deliver
//                    }
//                }
//                _on.apply(this, [name, onSelfAddressedEnvelope]);
//            };
//
//            var readFileSync = function(path) {
//                var result = fs.readFileSync(path).toString();
//                console.log('sync:')
//                console.log(result)
//                return result
//            }
//
//            var em = new events.EventEmitter()
//
//            console.log('starting readFileSync event')
//            em.on('readFileSync', readFileSync)
//            console.log(
//                em.emit('readFileSync', '/etc/resolv.conf')
//            )
//            console.log('ending readFileSync event')
//
//            var em2 = new (require('../promised-events').QEventEmitter)
//
//            console.log('starting Q readFileSync event')
//            em2.on('readFileSync', readFileSync)
//            em2.emit('readFileSync', '/etc/resolv.conf').then(function(result){
//                console.log('THEN sync:')
//                console.log(result)
//            })
//            console.log('ending Q readFileSync event')
//
//            var readFile = function(path) {
//                var defered = Q.defer()
//                fs.readFile(path, function(err, data) {
//                    if (!err) {
//                        console.log('async:')
//                        console.log(data.toString())
//                        defered.resolve(data.toString())
//                    } else {
//                        defered.reject(err)
//                    }
//                })
//                return defered.promise
//            }
//
//            //var em3 = new (require('../promised-events').PromisedEventEmitter)
//            var em3 = new events.EventEmitter()
//
//            console.log('starting Q readFile event')
//            em3.on('readFile', readFile)
//            em3.emit('readFile', '/etc/resolv.conf').then(function(result){
//                console.log('THEN async:')
//                console.log(result)
//            })
//            console.log('ending Q readFile event')
//
//        })
//    })
//})