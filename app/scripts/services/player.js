'use strict';

angular.module('akurraApp')
  .factory('Player', function (Keys, $interval, $rootScope, $log, User) {

    var that;
    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    function Player() {
      that = this;
      _.assign(this, EventEmitter.prototype);
      _.assign(this, {
        isPlaying: false,
        isMuted: false,
        currentTrack: null,
        position: 0,
        progress: 0,
        loadingProgress: 0
      });
    }
    // ------------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------------
    Player.prototype.init = function () {
      soundManager.setup({
        debugMode: false
      });
    };
    Player.prototype.playTrack = function (track, startPosition) {
      var then = Date.now();
      soundManager.createSound({
        id: track.id,
        url: track.stream_url + '?client_id=' + Keys.soundcloud.client_id, // jshint ignore:line
        volume: globalVolume,
        onload: function (success) {
          if (success) {
            console.log('loaded!');
            var diff = Date.now() - then;
            soundManager.setPosition(track.id, startPosition && startPosition + diff || 0);
            soundManager.play(track.id);
          } else {
            soundManager.destroySound(track.id);
            that.emit('loadError', track);
          }
        },
        onplay: function () {
          that.isPlaying = true;
          that.currentTrack = track;
          that.emit('startedPlayback', track);
        },
        onfinish: function () {
          that.isPlaying = false;
          soundManager.destroySound(track.id);
          that.emit('finishedPlayback', track);
        }
      });
    };
    Player.prototype.stop = function () {
      soundManager.destroySound(this.currentTrack.id);
      this.progress = 1;
      this.isPlaying = false;
    };
    Player.prototype.playPreview = function (track) {

    };
    Player.prototype.toggleMute = function () {
      this.isMuted = !this.isMuted;
      toggleMute();
      if (this.isMuted) {
        this.emit('mute');
      } else {
        this.emit('unmute');
      }
    };
    // ------------------------------------------------------------------------
    // Private helpers
    // ------------------------------------------------------------------------
    var globalVolume = 100;
    var globalVolumeTarget = 100;
    var volumeTransformInterval;

    function toggleMute() {
      globalVolumeTarget = that.isMuted ? 0 : 100;
      volumeTransformInterval = $interval(transformVolume, 40, 0, true);
    }

    function transformVolume() {
      if (globalVolume < globalVolumeTarget) {
        globalVolume += 1;
      } else {
        globalVolume -= 5;
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
      autoPlay: false,
      whileloading: function () {
        that.loadingProgress = this.bytesLoaded / this.bytesTotal;
        $rootScope.$apply();
      },
      whileplaying: function () {
        that.emit('tick', this.position);
        that.progress = this.position / this.duration;
        that.position = this.position;
        $rootScope.$apply();
      }
    };

    return new Player();
  });

