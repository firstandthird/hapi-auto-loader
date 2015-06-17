## hapi-auto-loader

Automatically loads server methods, routes, views, helpers.

#### Usage

See example directory for a full project.

```js
server.register({
  register: require('hapi-auto-loader'),
  options: {
    cwd: path.join(process.cwd(), 'example')
  }
}, function (err) {
  //code
});
```

For running again
```js
require('hapi-auto-loader')(server, options, next);
```

If you need to disable a loader, set the value to false.

```js
require('hapi-auto-loader')(server, {
  routes: false
}, next);
```

Configuring routes:

```js
require('hapi-auto-loader')(server, {
  routes: {
    base: '/cats/',
    context: {
      kitten: 'Mew'
    },
  }
}, next);
```

Routes in sub-directories can use the directory structure as the url path simply by not including a slash in the beginning of the path. See: `example/routes/api`
