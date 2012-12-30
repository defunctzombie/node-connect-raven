var raven = require('raven');

module.exports = function connectMiddleware(client) {

    // if client is not an instance of the raven client
    // then assume it is an options object and make a new client
    client = (client instanceof raven.Client) ? client : new raven.Client(client);

    return function(err, req, res, next) {

        var status = err.status || err.statusCode || err.status_code || 500;

        // skip anything not marked as an internal server error
        if (status < 500) {
            return next(err);
        }

        var packet = {};

        // decorate packet with http interface
        packet[raven.interfaces.http.key] = raven.interfaces.http(req);

        client.captureError(err, packet, function(result) {
            res.sentry = client.getIdent(result);

            // allow other error handling middleware to run
            next(err, req, res);
        });
    };
};
