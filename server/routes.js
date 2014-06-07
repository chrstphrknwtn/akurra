'use strict';

var index = require('./controllers')
  , user = require('./controllers/user')
  , keys = require('./controllers/keys');

/**
 * Application routes
 */
module.exports = function (app, angularRacer, store) {

  var model = store.createModel();

  app.get('/angular-racer.js', function (req, res) {
    res.type('js');
    res.send(angularRacer);
  });
  app.get('/keys.json', keys.soundcloud);

  app.get('/partials/*', index.partials);

  app.get('/user/id', user.getId);

  app.put('/user/pulse', function (req, res) {
    var b = req.body;
    var epoch = Date.now();
    model.set([b.path, b.id, 'pulse'].join('.'), b.pulse);
    model.set([b.path, b.id, 'timestamp'].join('.'), epoch);
    res.send(epoch+'');
  });

  app.get('/playlists/:playlistId', function (req, res) {

    if (/^[0-9]|[^0-9a-z-]/i.test(req.params.playlistId)) {
      return res.redirect('/');
    }
    var playlist = model.at('playlists.' + req.params.playlistId);
    model.subscribe(playlist, function (err) {
      if (err) {
        console.log('----------------------------------- Something broke, routes.js -----------------------------------------');
        console.log('Error subscribing to model ',  err);
        console.log('----------------------------------------------------------------------------');
        res.status(500);
        res.send(err);
      } else {
        // setup model
        if (!playlist.get('tracks')) {
          playlist.set('tracks', []);
        }
        if (!playlist.get('users')) {
          playlist.set('users', {});
        }

        model.bundle(function (err, bundle) {
          if (err) {
            console.log('----------------------------------- Something broke, routes.js -----------------------------------------');
            console.log('Error bundling model ',  err);
            console.log('----------------------------------------------------------------------------');
          }
          res.send(JSON.stringify(bundle));
        });
      }
    });
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/*', index.index);
};
