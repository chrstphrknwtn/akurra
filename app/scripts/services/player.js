'use strict';

angular.module('akurraApp')
  .factory('Player', function (Keys, $interval, $rootScope) {

    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    var Player = function () {
      _.mixin(this, new EventEmitter());
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
        volume: globalVolume,
        onplay: function () {
          that.isPlaying = true;
          that.currentTrack = track;
          that.isMuted = false;
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
    Player.prototype.toggleMute = function () {
      this.isMuted = !this.isMuted;
      toggleMute();
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    var globalVolume = 100;
    var globalVolumeTarget = 100;
    var volumeTransformInterval;

    function toggleMute() {
      globalVolumeTarget = that.isMuted ? 0 : 100;
      volumeTransformInterval = $interval(transformVolume, 20, 0, true);
    }

    function transformVolume() {
      if (globalVolume < globalVolumeTarget) {
        globalVolume += 1;
      } else {
        globalVolume -= 3;
      }
      // clip volume at 0 and 100
      globalVolume = globalVolume < 0 ? 0 : globalVolume;
      globalVolume = globalVolume > 100 ? 100 : globalVolume;

      if (globalVolume === 0 || globalVolume === 100) {
        $interval.cancel(volumeTransformInterval);
      }
      soundManager.setVolume(that.currentTrack.id, globalVolume);
    }

    soundManager.defaultOptions = {
      autoLoad: true,
      autoPlay: true,
      whileloading: function () {
        that.loadingProgress = this.bytesLoaded / this.bytesTotal;
        $rootScope.$apply();
      },
      whileplaying: function () {
        that.progress = this.position / this.duration;
        that.position = this.position;
        $rootScope.$apply();
      }
    };

    return new Player();
  });

