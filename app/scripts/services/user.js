'use strict';

angular.module('akurraApp')
  .factory('User', function ($cookies, $http) {

    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    function User() {
      that = this;
      this.id = null;
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

    return new User();
  });
