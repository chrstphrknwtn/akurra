'use strict';

var liveDbMongo = require('livedb-mongo')
  , config = require('./config');

module.exports = function (racer) {

  var redis, redisObserver;

  if (process.env.REDISCLOUD_URL) {
    var redisUrl = config.redisUrl;
    redis = require('redis').createClient(redisUrl.port, redisUrl.hostname);
    redis.auth(redisUrl.auth.split(':')[1]);
    redisObserver = require('redis').createClient(redisUrl.port, redisUrl.hostname);
    redisObserver.auth(redisUrl.auth.split(':')[1]);
  } else {
    redis = require('redis').createClient();
    redisObserver = require('redis').createClient();
  }
  redis.select(process.env.REDIS_DB || 1);

  // redis.debug_mode = true; // jshint ignore:line
  return racer.createStore({
    db: {
      db: liveDbMongo(config.mongoUrl + '?auto_reconnect', {safe: true}),
      redis: redis,
      redisObserver: redisObserver
    }
  });
};