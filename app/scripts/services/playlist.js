'use strict';

angular.module('akurraApp')
  .factory('Playlist', function (SoundCloud, Player) {
    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    var Playlist = function () {
      that = this;
      this.id = '';
      this.tracks = [];
      this.currentTrack = {
        duration: 259655
      };
    };
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    Playlist.prototype.createOrJoin = function (id) {
      this.id = id;
    };
    Playlist.prototype.addTrack = function (newTrack) {
      if (isDuplicate(newTrack)) {
        return false;
      }
      if (!Player.isPlaying) {
        Player.playTrack(newTrack);
      }
      // $scope.$apply(function () {
      this.tracks.push(newTrack);
      // });
      return true;
    };
    Playlist.prototype.removeTrack = function (track) {
      // soundManager.destroySound(trackID);
      //$scope.$apply(function () {
      this.tracks = _.reject(this.tracks, {'id': track.id});
      //});
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    function isDuplicate(newTrack) {
      return _.find(that.tracks, function (track) {
        return track.id === newTrack.id;
      });
    }
    return new Playlist();
  });
