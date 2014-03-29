'use strict';

angular.module('akurraApp')
  .factory('Keys', function ($http) {

    var that;

    function Keys() {
      that = this;
      this.soundcloud = null;
    }
    Keys.prototype.get = function () {
      return $http.get('/keys.json')
        .success(function (keys) {
          that.soundcloud = keys;
        });
    };
    return new Keys();
  });
