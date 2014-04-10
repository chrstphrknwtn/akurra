'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express')
  , config = require('./server/config/config')
  , http = require('http')
  , racer = require('racer');

// DB Setup
var store = require('./server/config/racer')(racer);

// Application Config
var app = express();

// Express settings
require('./server/config/express')(app, store);

// bundle client side angular-racer first
store.bundle(__dirname + '/server/angular-racer.js', function (err, angularRacer) {
  // define routes
  require('./server/routes')(app, angularRacer, store);
});

// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
