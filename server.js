'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express')
  , config = require('./server/config/config')
  , http = require('http')
  , racer = require('racer');


// DB Setup
var store = require('./server/config/racer')(racer);

// console.log(racer.init.toString());

// Application Config
var app = express();

// Express settings
require('./server/config/express')(app, store);

// Routing
require('./server/routes')(app);


// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
