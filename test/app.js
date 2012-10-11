var zlib = require('zlib');
var express = require('express');
var nock = require('nock');
var request = require('request');
var raven = require('raven');
var assert = require('assert');

var connect_raven = require('..');

var dsn = 'https://public:private@app.getsentry.com/269';

// create a so we can close nock scope
var client = new raven.Client(dsn);

var app = express();
app.use(app.router);
app.use(connect_raven(client));

// prevent fall through to default express error handler
app.use(function(err, req, res, next) {
});

app.get('/', function(req, res, next) {
    next(new Error('foobar'));
});

test('listen', function(done) {
    app.listen(3000, function() {
        done();
    });
});

test('basic', function(done) {
    var scope = nock('https://app.getsentry.com')
        .filteringRequestBody(/.*/, '*')
        .post('/api/store/', '*')
        .reply(200, function(uri, body) {
            zlib.inflate(new Buffer(body, 'base64'), function(err, buff) {
                var msg = JSON.parse(buff.toString());

                assert.ok(msg['sentry.interfaces.Http']);
                assert.equal(msg.message, 'Error: foobar');

                var http = msg['sentry.interfaces.Http'];
                assert.equal(http.method, 'GET');
                assert.equal(http.headers.host, 'localhost:3000');
                assert.equal(http.url, 'http://localhost:3000/');
            });

            done();
        });

    client.on('logged', function() {
        scope.done();
    });

    request('http://localhost:3000');
});
