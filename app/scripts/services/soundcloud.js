'use strict';

angular.module('akurraApp')
  .factory('SoundCloud', function ($rootScope) {
    var debouncedSearch = _.debounce(function (query) {
      if (query) {
        SC.get('/tracks', { q: query, limit: 200 }, function(tracks) {
          var filteredTracks = _.filter(tracks, function(track){
            return track.streamable;
          });
          $rootScope.$apply(function() {
            that.searchResults = filteredTracks;
          });
        });
      }
    }, 1000, false);

    var that;
    var SoundCloud = function () {
      that = this;
      this.isSearching = false;
      this.searchResults = [];
    };

    SoundCloud.prototype.init = function(keys) {
      SC.initialize(keys);
    };
    SoundCloud.prototype.search = function(query) {
      debouncedSearch(query);
    };
    return new SoundCloud();
  });
