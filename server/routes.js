'use strict';

var index = require('./controllers');
var keys = require('./controllers/keys');

/**
 * Application routes
 */
module.exports = function (app, angularRacer, store) {

  app.get('/model', function (req, res) {
    var model = store.createModel();
    model.subscribe('entries', function (err) {
      if (err) {
        console.log('----------------------------------- Something broke, routes.js -----------------------------------------');
        console.log('Error subscribing to model ',  err);
        console.log('----------------------------------------------------------------------------');
        res.status(500);
        res.send(err);
      } else {
        model.bundle(function (err, bundle) {
          if (err){
            console.log('----------------------------------- Something broke, routes.js -----------------------------------------');
            console.log('Error bundling model ',  err);
            console.log('----------------------------------------------------------------------------');
          }
          res.send(JSON.stringify(bundle));
        });
      }
    });
  });

  app.get('/angular-racer.js', function (req, res) {
    res.type('js');
    res.send(angularRacer);
  });
  app.get('/keys.json', keys.soundcloud);
  app.get('/partials/*', index.partials);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/*', index.index);
};
