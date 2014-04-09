'use strict';

angular.module('akurraApp')
  .factory('SoundCloud', function ($rootScope, $log) {

    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    var SoundCloud = function () {
      that = this;
      this.isSearching = false;
      this.searchResults = [];
    };
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    SoundCloud.prototype.init = function (keys) {
      SC.initialize(keys);
    };
    SoundCloud.prototype.search = function (query) {
      if (!!query) {
        this.isSearching = true;
        $log.log('Running SoundCloud search for', query);
        SC.get('/tracks', { q: query, limit: 200 }, onSearchComplete);
      }
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    function onSearchComplete(tracks, err) {

      that.isSearching = false;

      var filteredTracks = _.filter(tracks, function (track) {
        return track.streamable;
      });

      _.each(filteredTracks, function (track) {
        var artworkUrl = track.artwork_url || track.user.avatar_url; // jshint ignore:line
        var defaultCheckerRegExp = new RegExp(/default_avatar/);

        if (!artworkUrl || defaultCheckerRegExp.test(artworkUrl)) {
          track.generatedArtwork = generateArtwork();
        }
      });

      $rootScope.$apply(function () {
        that.searchResults = filteredTracks;
      });
    }
    function generateArtwork() {
      var colors = [
        // light purple
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNYlD79PwAF7wKg8UUQwgAAAABJRU5ErkJggg==',
        // baby pink
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4N2nlfwAIBAM5Rqt7HQAAAABJRU5ErkJggg==',
        // banana
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4tjL8PwAHhQL2aIPccQAAAABJRU5ErkJggg==',
        // green
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNYdKjyPwAGxALd3M1X2AAAAABJRU5ErkJggg==',
        // hot pink
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO47VbwHwAGIgKRJc4dAgAAAABJRU5ErkJggg==',
        // mint
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM48+rCfwAIkgOGrtHIjAAAAABJRU5ErkJggg=='
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    return new SoundCloud();
  });
