'use strict';

angular.module('akurraApp')
  .filter('scArtwork', function () {
    return function (input, size) {
      var toReturn;
      switch (size) {
        case 500:
          toReturn = input.replace('large.jpg', 't500x500.jpg');
          break;
        case 400:
          toReturn = input.replace('large.jpg', 'crop.jpg');
          break;
        case 300:
          toReturn = input.replace('large.jpg', 't300x300.jpg');
          break;
        case 47:
          toReturn = input.replace('large.jpg', 'badge.jpg');
          break;
        default:
          toReturn = input;
          break;
      }
      return toReturn;
    };
  });