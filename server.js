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


app.get('/model', function (req, res) {
  var model = req.getModel();
  model.subscribe('entries', function (err, entries) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      model.bundle(function (err, bundle) {
        res.send(JSON.stringify(bundle));
      });
    }
  });
});

// bundle client side angular-racer first
store.bundle(__dirname + '/server/angular-racer.js', function (err, js) {
  app.get('/angular-racer.js', function (req, res) {
    res.type('js');
    res.send(js);
  });
  // Routing
  require('./server/routes')(app);
});


// Start server
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
