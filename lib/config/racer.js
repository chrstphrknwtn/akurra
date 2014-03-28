'use strict';

var liveDbMongo = require('livedb-mongo')
  , redis = require('redis').createClient();

module.exports = function(racer) {
  redis.select(1);
  return racer.createStore({
    db: liveDbMongo('localhost:27017/racer-pad?auto_reconnect', {safe: true}),
    redis: redis
  });
}