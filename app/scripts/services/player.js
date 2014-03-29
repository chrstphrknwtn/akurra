'use strict';

angular.module('akurraApp')
  .factory('Player', function () {

    var Player = function () {

    };
    Player.prototype.init = function () {
      soundManager.setup({});
    };
    Player.prototype.stop = function () {
      // stop
    };
    return new Player();
  });

