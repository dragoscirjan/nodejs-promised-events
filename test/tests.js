/**
 * Created by dragosc on 09.05.2015.
 */

/* @link https://nodejs.org/api/assert.html */
var assert = require("assert")

var EventEmitter = require('events').EventEmitter;

var PromisedEventEmitter = require('../promised-events').PromisedEventEmitter;

var fs = require('fs')

var Q = require('q')

var readFileSync = function(path) {
    return fs.readFileSync(path).toString()
}

var readFile = function(path) {
    var defered = Q.defer()
    fs.readFile(path, function(err, data) {
        if (!err) {
            defered.resolve(data.toString())
        } else {
            defered.reject(err)
        }
    })
    return defered.promise
}

describe('EventEmitter', function() {
    describe('#emit()', function() {
        it('f(){ r 10 } should return true and nothing but true', function(){
            var em = new EventEmitter()
            em.on('f', function(){ return 10; })
            assert.equal(true, em.emit('f'))
        })
        it('(readFileSync) should return true and nothing but true', function() {
            var em = new EventEmitter()
            var content = true

            em.on('readFileSync', function(path){
                content = readFileSync(path)
                assert.equal(true, content.length > 0)
                assert.equal(true, typeof content == 'string')
            });
            assert.equal(true, em.emit('readFileSync', '/etc/hostname'))
            assert.equal(true, content.length > 0)
            assert.equal(true, typeof content == 'string')
        })
        it('(readFile) should return a promise', function(done){
            var em = new EventEmitter()
            em.on('readFile', function(path) {
                readFile(path).then(function (result) {
                    assert.equal(true, result.length > 0)
                    assert.equal(true, typeof result == 'string')
                    done()
                }, done)
            });
            assert.equal(true, em.emit('readFile', '/etc/hostname'))
        })
        it('(readFileSync && readFile) should return a promise', function(done){
            var em = new EventEmitter()
            var content = true

            em.on('read', function(path){
                content = readFileSync(path)
                assert.equal(true, content.length > 0)
                assert.equal(true, typeof content == 'string')
            });
            em.on('read', function(path) {
                readFile(path).then(function (result) {
                    assert.equal(true, result.length > 0)
                    assert.equal(true, typeof result == 'string')
                    done()
                }, done)
            });
            assert.equal(true, em.emit('read', '/etc/hostname'))
        })
    })
})

describe('PromisedEventEmitter', function(){
    describe('#emit()', function(){
        it('f(){ r 10 } should return a promise', function(done){
            var em = new PromisedEventEmitter()
            em.on('f', function(){ return 10; })
            em.emit('f').then(function(result){
                assert.equal(10, result)
                done()
            }, done)
        })
        it('(readFileSync) should return a promise', function(done) {
            var em = new PromisedEventEmitter()

            em.on('readFileSync', readFileSync);
            em.emit('readFileSync', '/etc/hostname').then(function (result) {
                assert.equal(true, result.length > 0)
                assert.equal(true, typeof result == 'string')
                done()
            }, done)
        })
        it('(readFile) should return a promise', function(done){
            var em = new PromisedEventEmitter()

            em.on('readFile', readFile);
            em.emit('readFile', '/etc/hostname').then(function (result) {
                assert.equal(true, result.length > 0)
                assert.equal(true, typeof result == 'string')
                done()
            }, done)
        })
        it('(readFileSync && readFile) should return a promise', function(done){
            var em = new PromisedEventEmitter()

            em.on('read', readFile);
            em.on('read', readFileSync);
            em.emit('read', '/etc/hostname').then(function (result) {
                assert.equal(true, result.length == 2)
                assert.equal(true, result[0].length > 0)
                assert.equal(true, result[1].length > 1)

                assert.equal(true, typeof result == 'object')
                assert.equal(true, typeof result[0] == 'string')
                assert.equal(true, typeof result[1] == 'string')
                done()
            }, done)
        })
    })
})