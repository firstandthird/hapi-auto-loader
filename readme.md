## hapi-auto-loader

Automatically loads server methods, routes, views, helpers.

#### Usage

See example directory for a full project.

```js
server.register({
  register: require('hapi-auto-load'),
  options: {
    cwd: path.join(process.cwd(), 'example')
  }
}, function (err) {
  //code
});
```