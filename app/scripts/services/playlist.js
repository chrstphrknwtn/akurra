'use strict';

angular.module('akurraApp')
  .factory('Playlist', function (SoundCloud, Player, Racer, User, $timeout, $rootScope, $http) {

    var that;
    var tracksPath;
    var usersPath;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    function Playlist () {
      that = this;
      _.assign({
        id: null,
        tracksPath: null,
        usersPath: null,
        tracks: [],
        users: {},
        numUsers: 0
      });
    }
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    Playlist.prototype.createOrJoin = function (id) {
      this.id = id;
      tracksPath = ['playlists', id, 'tracks'].join('.');
      usersPath = ['playlists', id, 'users'].join('.');
      return Racer.init(id)
        .then(function () {
          that.tracks = Racer.model.get(tracksPath);
          that.users = Racer.model.get(usersPath);

          Racer.model.set([usersPath, User.id].join('.'), User.simplified());
          Racer.model.on('all', tracksPath, tryPlayTrack);
          Racer.model.on('remove', tracksPath, onTrackRemoved);
          Racer.model.on('error', onRacerError);
          tryPlayTrack(getHighestProgress());
        });
    };
    Playlist.prototype.addTrack = function (newTrack) {
      if (!Racer.isReady || isDuplicate(newTrack)) {
        return false;
      }
      newTrack.akurraUserId = User.id;
      Racer.model.push(tracksPath, newTrack);

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
      Racer.model.remove(tracksPath, index, 1);
      if (this.tracks.length) {
        tryPlayTrack();
      }
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    function onTrackRemoved(path, removed) {
      if (removed &&
          removed[0] &&
          removed[0].id &&
          Player.currentTrack &&
          removed[0].id === Player.currentTrack.id) {
        Player.stop();
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
    function updatePulse(pulse) {
      Racer.model.set([usersPath, User.id, 'pulse'].join('.'), pulse);
      // $http.put('/user/pulse', {
      //   path: usersPath,
      //   id: User.id,
      //   name: that.name,
      //   pulse: pulse
      // })
      // .success(updateNumUsers);
    }
    function updateNumUsers(serverEpoch) {
      var allTimestamps = _.pluck(that.users, 'timestamp');
      var alive = _.filter(allTimestamps, function (timestamp) {
        return serverEpoch - timestamp < 3000;
      });

      that.numUsers = alive.length > 0 ? alive.length : 1;
    }
    function getHighestProgress() {
      return _(that.users).pluck('pulse').max().value();
    }

    Player.on('loadError', function (track) {
      console.log('[Playlist loadError]');
      that.removeTrack(track);
    });

    Player.on('finishedPlayback', function (track) {
      console.log('[Playlist finishedPlayback]');
      that.removeTrack(track);
    });

    var throttledUpdatePulse = _.throttle(updatePulse, 1000);
    Player.on('tick', throttledUpdatePulse);

    function tryPlayTrack(position) {
      var canPlay = !!(!Player.isPlaying && that.tracks && that.tracks.length);
      console.log('[Playlist.tryPlayTrack] ', canPlay);
      if (canPlay) {
        Player.playTrack(that.tracks[0], position || 0);
      }
    }

    function isDuplicate(newTrack) {
      return _.find(that.tracks, function (track) {
        return track.id === newTrack.id;
      });
    }
    return new Playlist();
  });
