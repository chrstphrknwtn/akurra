'use strict';

var liveDbMongo = require('livedb-mongo')
  , redis = require('redis')
  , config = require('./config');

module.exports = function (racer) {
  var client;
  if (process.env.NODE_ENV === 'production') {
    client = redis.createClient(config.redisUrl.port, config.redisUrl.hostname, {no_ready_check: true}); // jshint ignore:line
    client.auth(config.redisUrl.auth.split(':')[1]);
  } else {
    client = redis.createClient();
  }
  client.select(1);
  return racer.createStore({
    db: {
      db: liveDbMongo(config.mongoUrl + '?auto_reconnect', {safe: true}),
      redis: client
    }
  });
};