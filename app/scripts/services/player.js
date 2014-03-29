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
      this.currentTrack = null;
      this.isMuted = false;
      this.progress = 0;
      this.loadingProgress = 0;
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
        volume: 100,
        whileloading: function () {
          that.loadingProgress = this.bytesLoaded / this.bytesTotal;
          that.emit('loadingProgress', this.loadingProgress);
        },
        whileplaying: function () {
          that.progress = this.position / this.duration;
        },
        onplay: function () {
          that.isPlaying = true;
          that.currentTrack = track;
          that.isMuted = false;
          that.emit('startedPlayback', this.loadingProgress);
        },
        onfinish: function () {
          that.isPlaying = false;
          that.emit('finishedPlayback', track);
          // removeTrack(track.id);
          // playNextTrack();
        }
      });
    };
    Player.prototype.mute = function () {
      that.isMuted = true;
      // soundManager.toggleMute(currentTrackId);
    };
    return new Player();
  });

