'use strict';

angular.module('akurraApp')
  .filter('scArtwork', function () {

    function createRandomArtwork() {
      // angular wigs out if more than one is used?
      var colors = [
        // light purple
        // 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNYlD79PwAF7wKg8UUQwgAAAABJRU5ErkJggg==',
        // baby pink
        // 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4N2nlfwAIBAM5Rqt7HQAAAABJRU5ErkJggg==',
        // banana
        // 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4tjL8PwAHhQL2aIPccQAAAABJRU5ErkJggg=='
        // green
        // 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNYdKjyPwAGxALd3M1X2AAAAABJRU5ErkJggg=='
        // hot pink
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO47VbwHwAGIgKRJc4dAgAAAABJRU5ErkJggg==',
        // mint
        // 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM48+rCfwAIkgOGrtHIjAAAAABJRU5ErkJggg=='
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    var defaultCheckerRegExp = new RegExp(/default_avatar/);

    return function (track, size) {
      var artwork;
      var artworkUrl = track.artwork_url || track.user.avatar_url; // jshint ignore:line

      if (!artworkUrl || defaultCheckerRegExp.test(artworkUrl)) {
        return createRandomArtwork();
      }
      switch (size) {
        case 500:
          artwork = artworkUrl.replace('large.jpg', 't500x500.jpg');
          break;
        case 400:
          artwork = artworkUrl.replace('large.jpg', 'crop.jpg');
          break;
        case 300:
          artwork = artworkUrl.replace('large.jpg', 't300x300.jpg');
          break;
        case 47:
          artwork = artworkUrl.replace('large.jpg', 'badge.jpg');
          break;
        default:
          artwork = artworkUrl;
          break;
      }
      return artwork;
    };
  });

  // A26797
  // E45A73
  // F6A957
  // CCEAD0
  // A2C279
  // FE92A9
  // DB4670