'use strict';

angular.module('akurraApp')
  .factory('Player', function (Keys, $timeout, $rootScope) {

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
      this.position = 0;
      this.loadingProgress = 0;
    };
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    Player.prototype.init = function () {
      soundManager.setup({
        debugMode: false
      });
    };
    Player.prototype.playTrack = function (track) {
      soundManager.createSound({
        id: track.id,
        url: track.stream_url + '?client_id=' + Keys.soundcloud.client_id, // jshint ignore:line
        autoLoad: true,
        autoPlay: true,
        volume: 0,
        // volume: 100,
        whileloading: function () {
          that.loadingProgress = this.bytesLoaded / this.bytesTotal;
          $rootScope.$apply();
          // that.emit('loadingProgress', this.loadingProgress);
        },
        whileplaying: function () {
          that.progress = this.position / this.duration;
          that.position = this.position;
          $rootScope.$apply();
          // that.emit('progress', this.progress);
        },
        onplay: function () {
          that.isPlaying = true;
          that.currentTrack = track;
          that.isMuted = false;
          // that.emit('startedPlayback', this.loadingProgress);
        },
        onfinish: function () {
          that.isPlaying = false;
          soundManager.destroySound(track.id);
          that.emit('finishedPlayback', track);
        }
      });
    };
    Player.prototype.playPreview = function (track) {

    };
    Player.prototype.mute = function () {
      that.isMuted = true;
      soundManager.toggleMute(this.currentTrack.id);
    };
    return new Player();
  });

