'use strict';

angular.module('akurraApp')
  .filter('500', function () {
    return function (input) {
      return input.replace('large.jpg', 't500x500.jpg');
    };
  })
  .filter('400', function () {
    return function (input) {
      return input.replace('large.jpg', 'crop.jpg');
    };
  })
  .filter('300', function () {
    return function (input) {
      return input.replace('large.jpg', 't300x300.jpg');
    };
  })
  .filter('47', function () {
    return function (input) {
      return input.replace('large.jpg', 'badge.jpg');
    };
  });
