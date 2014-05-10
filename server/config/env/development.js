'use strict';

var url = require('url');

module.exports = {
  env: 'development',
  redisUrl: url.parse(process.env.REDISCLOUD_URL),
  mongoUrl: process.env.MONGOLAB_URI
};
