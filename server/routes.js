'use strict';

var index = require('./controllers');
var keys = require('./controllers/keys');

/**
 * Application routes
 */
module.exports = function (app) {
  app.get('/keys.json', keys.soundcloud);
  app.get('/partials/*', index.partials);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/*', index.index);
};
