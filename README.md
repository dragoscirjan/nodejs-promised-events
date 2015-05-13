# Promised Events

Package has same functionality as Node.js Events, however, the *emit* function will always pomisify all functions called for a certain event.

## Example 1 (Promisified Callbacks)

```js
  em = new require('promised-events').PromisedEventEmitter
  em.on('f', function(){ return 10; })
  em.emit('f').then(function(result){
    console.log(result)
  }, function(err) {
    throw err;
  })
```

Will print *10*.

## Example 2 (Promisifed Callbacks)

```js
  fs = require('fs')
  em.on('readFileSync', function(path) {
    return fs.readFileSync(path);
  });
  em.emit('readFileSync', '/etc/hostname').then(function (fileContent) {
    console.log(fileContent)
  }, function(err) {
    throw err;
  })
})
```

Will print the content of "/etc/hostname" file. If *fs.fileReadSync* will throw an error, it will be felt without being caught by the fail callback assigned to the promise.

## Example 3 (Promised Callbacks)

```js
  fs = require('fs')
  Q = require('q')
  em.on('readFile', function(path) {
    var defered = Q.defer()
    fs.readFile(path, function(err, data) {
      if (err) {
        defered.reject(err)
      } else {
        defered.resolve(data)
      }
    })
    return defered.promise
  });
  em.emit('readFile', '/etc/hostname').then(function (fileContent) {
    console.log(fileContent)
  }, function(err) {
    throw err
  })
```

Will print the content of "/etc/hostname" file or throw the error sent to the fail callback assigned to the promise.

## Example 4 (Multiple Callbacks)

```js
  fs = require('fs')
  Q = require('q')

  // first callback
  em.on('read', function(path) {
    return fs.readFileSync(path);
  });
  // second callback
  em.on('read', function(path) {
    var defered = Q.defer()
    fs.readFile(path, function(err, data) {
      if (err) {
        defered.reject(err)
      } else {
        defered.resolve(data)
      }
    })
    return defered.promise
  });

  // trigger event
  em.emit('read', '/etc/hostname').then(function (readConent) {
    for (var i = 0; i < readContent.length; i++) {
      console.log(readContent[i])
    }
  }, function(err) {
    throw err
  })
})
```

If all callbacks will run without errors, *readContent* will return an array of results, for each promised function. Otherwise, it will throw the first encountered error.
