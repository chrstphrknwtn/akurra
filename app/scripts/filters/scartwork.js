'use strict';

angular.module('akurraApp')
  .filter('scArtwork', function () {

    return function (track, size) {

      if (track.generatedArtwork) {
        return track.generatedArtwork;
      }
      var artwork;
      var artworkUrl = track.artwork_url || track.user.avatar_url; // jshint ignore:line

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
        case 100:
          artwork = artworkUrl;
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