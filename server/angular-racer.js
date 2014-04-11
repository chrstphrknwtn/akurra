'use strict';

angular.module('racer.js', [])
  .factory('Racer', ['$http', '$q', '$rootScope', '$log', function ($http, $q, $rootScope, $log) {

    var racerjs = require('racer');
    var that;

    function Racer() {
      that = this;
      this.model = null;
      this.isReady = null;
    }

    Racer.prototype.init = function (playlistId) {
      var deferred = $q.defer();

      $http.get('/model')
        .success(function (data) {
          racerjs.ready(function (model) {
            that.model = model;
            that.isReady = true;
            deferred.resolve(model);
          });
          racerjs.init(data);
        })
        .error(function (err) {
          console.log('Racer could not get model', err);
        });
      return deferred.promise;
    };

    return new Racer();
  }]);