'use strict';

angular.module('akurraApp')
  .factory('Playlist', function (SoundCloud) {
    var Playlist = function () {
      this.id = '';
      this.tracks = [];
      this.currentTrack = {
        duration: 259655
      };
    };
    Playlist.prototype.createOrJoin = function (id) {
      this.id = id;
    };
    Playlist.prototype.addTrack = function (trackIndex) {
      console.log(SoundCloud.searchResults[trackIndex]);
    };
    return new Playlist();
  });
