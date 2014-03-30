'use strict';

angular.module('akurraApp')
  .filter('normalizedToPercentage', function () {
    return function (norm) {
      return (norm * 100) + '%';
    };
  });
