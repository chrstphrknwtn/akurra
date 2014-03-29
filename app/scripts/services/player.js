'use strict';

angular.module('akurraApp')
  .factory('Player', function (Keys, $timeout) {

    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    var Player = function () {
      _.extend(this, new EventEmitter());
      that = this;
      this.isPlaying = false;
      this.currentTrackId = null;
      this.isMuted = false;
      this.progress = 0;
    };
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    Player.prototype.init = function () {
      soundManager.setup({});
    };
    Player.prototype.stop = function () {
      // stop
    };
    Player.prototype.playTrack = function (track) {
      soundManager.createSound({
        id: track.id,
        url: track.stream_url + '?client_id=' + Keys.soundcloud.client_id, // jshint ignore:line
        autoLoad: true,
        autoPlay: true,
        whileloading: function () {
          // var that = this;
          // $timeout(function () {
          //   $scope.loadedProgress = {value: ((that.bytesLoaded / that.bytesTotal) * 100 + '%')};
          // });
        },
        onload: function () {
        },
        onplay: function () {
          that.isPlaying = true;
          that.currentTrackId = track.id;
          that.isMuted = false;
        },
        whileplaying: function () {
          // var that = this;
          // $timeout(function () {
          //   $scope.elapsed = {value: that.position};
          //   $scope.playedProgress = {value: ((that.position / that.duration) * 100 + '%')};
          // });
        },
        onfinish: function () {
          that.isPlaying = false;
          // removeTrack(track.id);
          // playNextTrack();
        },
        volume: 100
      });
    };
    Player.prototype.mute = function () {
      that.isMuted = true;
      // soundManager.toggleMute(currentTrackId);
    };
    return new Player();
  });

