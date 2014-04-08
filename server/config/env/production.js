'use strict';

var url = require('url');

module.exports = {
  env: 'production',
  redisUrl: url.parse(process.env.REDISCLOUD_URL),
  mongoUrl: process.env.MONGOLAB_URI
};