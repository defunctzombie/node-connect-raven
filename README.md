# connect-raven

connect/[express](http://expressjs.com/) error middleware logging through [raven](https://github.com/mattrobenolt/raven-node)

## use

```javascript
var connect_raven = require('connect-raven');

var app = express();

// other middleware here

// routes ...
// app.get
// app.post

// the router should come before the error handling
app.use(app.router);

// make sure to use this middleware last
app.use(connect_raven( {{ SENTRY DSN }} ));
```

## references

 * http://expressjs.com/guide.html#error-handling
