# connect-raven

connect/[express](http://expressjs.com/) error middleware logging through [raven](https://github.com/mattrobenolt/raven-node)

## use

```javascript
var connect_raven = require('connect-raven');

var app = express();

// other middleware here

// the router should come before the error handling
app.use(app.router);

// make sure to use this middleware after the router
app.use(connect_raven( {{ SENTRY DSN }} ));

// routes ...
// app.get
// app.post

```

## references
 * http://expressjs.com/guide.html#error-handling
