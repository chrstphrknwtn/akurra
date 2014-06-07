'use strict';

angular.module('akurraApp')
  .factory('SoundCloud', function ($rootScope, $log, $timeout) {

    var colorCounter = 0;
    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    function SoundCloud() {
      that = this;
      _.assign(this, {
        isSearching: false,
        searchResults: []
      });
    }
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
        that.isSearching = true;
        searchOptions.q = null;

        switch (powerSearchType) {
          case 'user':
            getUserId(powerSearchQuery, function (userID) {
              searchEndpoint = '/users/' + userID + '/tracks';
              searchSoundcloud(searchEndpoint, searchOptions);
            });
            break;
          case 'like':
          case 'likes':
            getUserId(powerSearchQuery, function (userID) {
              searchEndpoint = '/users/' + userID + '/favorites';
              searchSoundcloud(searchEndpoint, searchOptions);
            });
            break;
          case 'genre':
          case 'genres':
            searchOptions.genres = powerSearchQuery;
            searchSoundcloud(searchEndpoint, searchOptions);
            break;
          case 'tag':
          case 'tags':
            searchOptions.tags = powerSearchQuery;
            searchSoundcloud(searchEndpoint, searchOptions);
            break;
        }
      } else {
        searchSoundcloud(searchEndpoint, searchOptions);
      }
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
    function getUserId(query, cb) {
      var resolveUrl = 'http://soundcloud.com/' + query;
      SC.get('/resolve', {url: resolveUrl}, function (user) {
        if (user) cb(user.id);
      });
    }
    function searchSoundcloud(searchEndpoint, searchOptions) {
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
