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
      this.tracks.push(newTrack);
      if (!Player.isPlaying) {
        Player.playTrack(newTrack);
      }
      return true;
    };
    Playlist.prototype.removeTrack = function (track) {
      var index = this.tracks.indexOf(track);
      if (index !== -1) {
        this.tracks.splice(index, 1);
      }
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    Player.on('finishedPlayback', function (track) {
      that.removeTrack(track);
      if (that.tracks.length) {
        Player.playTrack(that.tracks[0]);
      }
    });

    function isDuplicate(newTrack) {
      return _.find(that.tracks, function (track) {
        return track.id === newTrack.id;
      });
    }
    return new Playlist();
  });
