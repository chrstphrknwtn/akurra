'use strict';

angular.module('akurraApp')
  .filter('scArtwork', function () {
    return function (input, size) {
      switch (size) {
        case 500: return input.replace('large.jpg', 't500x500.jpg'); break;
        case 400: return input.replace('large.jpg', 'crop.jpg'); break;
        case 300: return input.replace('large.jpg', 't300x300.jpg'); break;
        case 47:  return input.replace('large.jpg', 'badge.jpg'); break;
        default:  return input; break;
      }
    }
  });