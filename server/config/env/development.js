'use strict';

var url = require('url');

module.exports = {
  env: 'development',
  redisUrl: url.parse('redis://127.0.0.1:6379'),
  mongoUrl: 'localhost:27017/akurra'
};
