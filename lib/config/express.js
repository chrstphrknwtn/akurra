'use strict';

var express = require('express')
  , path = require('path')
  , racerBrowserChannel = require('racer-browserchannel')
  , config = require('./config');

/**
 * Express configuration
 */
module.exports = function (app, store) {
  app.configure('development', function () {
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    app.set('views', config.root + '/app/views');
  });

  app.configure('production', function () {
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/views');
  });

  app.configure(function () {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.compress());
    app.use(racerBrowserChannel(store));
    app.use(store.modelMiddleware());
    // Router (only error handlers should come after this)
    app.use(app.router);
    app.use(function (err, req, res, next) {
      console.error(err.stack || (new Error(err)).stack);
      res.send(500, 'Something broke!');
    });
  });

  // Error handler
  app.configure('development', function () {
    app.use(express.errorHandler());
  });
};