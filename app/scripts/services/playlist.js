'use strict';

angular.module('akurraApp')
  .factory('Playlist', function (SoundCloud, Player, Racer, User, $timeout, $rootScope) {

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
          tryPlayTrack();
          Racer.model.on('all', tryPlayTrack);
          Racer.model.on('remove', onTrackRemoved);
          Racer.model.on('error', onRacerError);
        });
    };
    Playlist.prototype.addTrack = function (newTrack) {
      if (!Racer.isReady || isDuplicate(newTrack)) {
        return false;
      }
      newTrack.akurraUserId = User.id;
      Racer.model.push(that.tracksPath, newTrack);

      tryPlayTrack(newTrack);
      return true;
    };
    Playlist.prototype.removeTrack = function (track) {
      if (!Racer.isReady) {
        return false;
      }
      if (track === Player.currentTrack) {
        Player.stop();
      }
      console.log('[Playlist.removeTrack] ', this.tracks.indexOf(track));

      var index = this.tracks.indexOf(track);
      Racer.model.remove(that.tracksPath, index, 1);

      if (this.tracks.length) {
        tryPlayTrack();
      }
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    function onTrackRemoved(path, details) {
      if (details &&
          details[1] &&
          details[1] &&
          details[1][0].id &&
          details[1][0].id === Player.currentTrack.id) {
        Player.stop();
        tryPlayTrack();
      }
      $timeout(function() {
        $rootScope.$apply();
      });
    }
    function onRacerError(err) {
      console.log('------------ RacerJS Model error --------------');
      console.log(err);
      console.log('-----------------------------------------------');
    }

    Player.on('finishedPlayback', function (track) {
      console.log('[Playlist finishedPlayback]');
      that.removeTrack(track);
      tryPlayTrack();
    });

    function tryPlayTrack() {
      console.log('[Playlist.tryPlayTrack] ', !!(!Player.isPlaying && that.tracks && that.tracks.length));
      if (!Player.isPlaying && that.tracks && that.tracks.length) {
        Player.playTrack(that.tracks[0]);
      }
    }

    function isDuplicate(newTrack) {
      return _.find(that.tracks, function (track) {
        return track.id === newTrack.id;
      });
    }
    return new Playlist();
  });
