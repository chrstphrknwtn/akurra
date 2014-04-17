'use strict';

module.exports = {
  getId: function (req, res) {
    res.send([Date.now(), ~~(Math.random() * 1000)].join(''));
  }
};