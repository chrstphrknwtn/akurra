'use strict';

angular.module('akurraApp')
  .factory('Keys', function ($resource) {
    return $resource('/keys.json');
  });
