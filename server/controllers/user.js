'use strict';

module.exports = {
  getId: function (req, res) {
    res.send(['u', Date.now(), ~~(Math.random() * 1000)].join(''));
  }
};