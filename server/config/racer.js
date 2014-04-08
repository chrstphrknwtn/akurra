'use strict';

var liveDbMongo = require('livedb-mongo')
  // , redis = require('redis')
  , config = require('./config');

module.exports = function (racer) {

  var redis, redisObserver;
  // redis.debug_mode = true; // jshint ignore:line

  if (process.env.REDISCLOUD_URL) {
    var redisUrl = config.redisUrl;
    redis = require('redis').createClient(redisUrl.port, redisUrl.hostname);
    redis.auth(redisUrl.auth.split(":")[1]);
    redisObserver = require('redis').createClient(redisUrl.port, redisUrl.hostname);
    redisObserver.auth(redisUrl.auth.split(":")[1]);
  } else {
    redis = require('redis').createClient();
    redisObserver = require('redis').createClient();
  }
  redis.select(process.env.REDIS_DB || 1);

  return racer.createStore({
    db: {
      db: liveDbMongo(config.mongoUrl + '?auto_reconnect', {safe: true})
    , redis: redis
    , redisObserver : redisObserver
    }
  });

  // var client;
  // if (process.env.NODE_ENV === 'production') {
  //   client = redis.createClient(config.redisUrl.port, config.redisUrl.hostname, {auth_pass: config.redisUrl.auth.split(':')[1], no_ready_check: true}); // jshint ignore:line
  // } else {
  //   client = redis.createClient();
  // }
  // return racer.createStore({
  //   db: {
  //     db: liveDbMongo(config.mongoUrl + '?auto_reconnect', {safe: true}),
  //     redis: client
  //   }
  // });
};