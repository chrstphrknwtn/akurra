'use strict';

angular.module('akurraApp')
  .factory('SoundCloud', function ($rootScope, $log, $timeout) {

    var colorCounter = 0;
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
      if (!query) return;

      var searchEndpoint = '/tracks'; // default to be overridden for power searching
      var searchOptions = {
        q: query,
        limit: 200
      };
      var powerSearch = query.match(/(^user|likes|like|genres|genre|label|tags|tag)(?::)(?:\s*)(.*)/i);
      var userID;

      if (powerSearch) {
        var powerSearchType = powerSearch[1].toLowerCase();
        var powerSearchQuery = powerSearch[2].replace(/(,\s*)/g, ',');

        if (!searchOptions.q) return;
        searchOptions.q = null;

        switch (powerSearchType) {
          case 'user':
            // var resolveUrl = 'http://soundcloud.com/' + powerSearchQuery;
            // SC.get('/resolve', {url: resolveUrl}, function(user) {
            //   if (user) userID = user.id;
            // });
            searchEndpoint = '/users/' + '2784016' + '/tracks';
            break;
          case 'like':
          case 'likes':
            userID = 2784016;
            searchEndpoint = '/users/' + userID + '/favorites';
            break;
          case 'genre':
          case 'genres':
            searchOptions.genres = powerSearchQuery;
            break;
          case 'tag':
          case 'tags':
            searchOptions.tags = powerSearchQuery;
            break;
        }
      }
      searchSoundcloud(searchEndpoint, searchOptions);
    };
    SoundCloud.prototype.generateArtwork = function() {
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
      return colors[colorCounter++ % colors.length];
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    function searchSoundcloud(searchEndpoint, searchOptions) {
      that.isSearching = true;
      SC.get(searchEndpoint, searchOptions, onSearchComplete);
    }
    function onSearchComplete(tracks, err) {
      that.isSearching = false;


      var filteredTracks = _.filter(tracks, function (track) {
        return track.streamable;
      });

      _.each(filteredTracks, function (track) {
        var artworkUrl = track.artwork_url || track.user.avatar_url; // jshint ignore:line
        var defaultCheckerRegExp = new RegExp(/default_avatar/);

        if (!artworkUrl || defaultCheckerRegExp.test(artworkUrl)) {
          track.generatedArtwork = that.generateArtwork();
        }
      });

      $rootScope.$apply(function () {
        that.searchResults = filteredTracks;
      });
    }
    return new SoundCloud();
  });
