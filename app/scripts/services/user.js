'use strict';

angular.module('akurraApp')
  .factory('User', function ($cookies, $http) {

    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    function User() {
      that = this;
      _.assign(this, {
        id: null,
        name: null
      });
    }

    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    User.prototype.init = function () {
      that.id = $cookies.akurraUserId;
      that.id || $http.get('/user/id')
        .success(function (id) {
          that.id = $cookies.akurraUserId = id;
        });
    };
    User.prototype.pulse = function () {
      // move it to here
    };
    User.prototype.simplified = function () {
      return {
        name: that.name,
        pulse: 0,
        timestamp: 0
      };
    };

    return new User();
  });
