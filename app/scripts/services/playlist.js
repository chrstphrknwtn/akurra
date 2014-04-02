'use strict';

angular.module('akurraApp')
  .factory('Playlist', function (SoundCloud, Player, Racer, $rootScope) {

    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    var Playlist = function () {
      that = this;
      this.id = '';
      this.tracks = [];
    };
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    Playlist.prototype.createOrJoin = function (id) {
      return Racer.init(id)
        .then(function () {
          that.tracks = Racer.model.get('entries.tracks');
          tryPlayTrack();
          Racer.model.on('all', function () {
            console.log('all');
            tryPlayTrack();
          });
        });
    };
    Playlist.prototype.addTrack = function (newTrack) {
      if (!Racer.isReady || isDuplicate(newTrack)) {
        return false;
      }

      Racer.model.push('entries.tracks', newTrack);

      if (!Player.isPlaying) {
        Player.playTrack(newTrack);
      }
      return true;
    };
    Playlist.prototype.removeTrack = function (track) {
      if (!Racer.isReady) {
        return false;
      }
      var index = this.tracks.indexOf(track);
      if (index !== -1) {
        var removed = Racer.model.shift('entries.tracks');
        if (removed !== track) {
          Racer.model.insert('entries.tracks', 0, track);
        }
      }
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    Player.on('finishedPlayback', function (track) {
      that.removeTrack(track);
    });

    function tryPlayTrack() {
      if (!Player.isPlaying && that.tracks.length) {
        Player.playTrack(that.tracks[0]);
      }
    }

    function isDuplicate(newTrack) {
      return false;
      // return _.find(that.tracks, function (track) {
      //   return track.id === newTrack.id;
      // });
    }
    return new Playlist();
  });
