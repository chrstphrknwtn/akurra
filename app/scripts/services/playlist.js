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
      this.tracksPath = '';
      this.tracks = [];
    };
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    Playlist.prototype.createOrJoin = function (id) {
      this.id = id;
      this.tracksPath = 'playlists.' + id + '.tracks';
      return Racer.init(id)
        .then(function () {
          that.tracks = Racer.model.get(that.tracksPath);
          console.log(that.tracks);
          tryPlayTrack();
          Racer.model.on('all', function () {
            tryPlayTrack();
          });
          Racer.model.on('error', function (err) {
            console.log('------------ RacerJS Model error --------------');
            console.log(err);
            console.log('-----------------------------------------------');
          });
        });
    };
    Playlist.prototype.addTrack = function (newTrack) {
      if (!Racer.isReady || isDuplicate(newTrack)) {
        return false;
      }
      Racer.model.push(that.tracksPath, newTrack);

      tryPlayTrack(newTrack);
      return true;
    };
    Playlist.prototype.removeTrack = function (track) {
      if (!Racer.isReady) {
        return false;
      }
      var index = this.tracks.indexOf(track);
      if (index !== -1) {
        var removed = Racer.model.shift(that.tracksPath);
        if (removed !== track) {
          Racer.model.insert(that.tracksPath, 0, track);
        }
      }
      $rootScope.$apply();
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    Player.on('finishedPlayback', function (track) {
      that.removeTrack(track);
      tryPlayTrack();
    });

    function tryPlayTrack() {
      if (!Player.isPlaying && that.tracks && that.tracks.length) {
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
