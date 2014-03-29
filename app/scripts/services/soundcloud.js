'use strict';

angular.module('akurraApp')
  .factory('SoundCloud', function ($rootScope) {
    // var debouncedSearch = _.debounce(function (query) {
    //   if (query) {
    //     SC.get('/tracks', { q: query, limit: 200 }, function (tracks) {
    //       var filteredTracks = _.filter(tracks, function (track) {
    //         return track.streamable;
    //       });
    //       $rootScope.$apply(function () {
    //         that.searchResults = filteredTracks;
    //       });
    //     });
    //   }
    // }, 1000, false);

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
      console.log(query)
      if (query) {
        console.log('Running SoundCloud search for', query);
        SC.get('/tracks', { q: query, limit: 200 }, function (tracks) {
          var filteredTracks = _.filter(tracks, function (track) {
            return track.streamable;
          });
          $rootScope.$apply(function () {
            that.searchResults = filteredTracks;
          });
        });
      }
    };
    return new SoundCloud();
  });
