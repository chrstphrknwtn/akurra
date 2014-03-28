'use strict';

angular.module('akurraApp')
  .filter('msToDuration', function () {
    var time = {};
    function twoDigits(n) {
      return n > 9 ? '' + n : '0' + n;
    }
    function preventNaN(n) {
      return isNaN(n) ? 0 : n;
    }
    return function(s) {
      time.ms = s % 1000;
      s = (s - time.ms) / 1000;
      time.secs = s % 60;
      s = (s - time.secs) / 60;
      time.mins = s % 60;
      time.hrs = (s - time.mins) / 60;

      time.mins = preventNaN(time.mins);
      time.secs = preventNaN(time.secs);

      if (time.hrs > 0) {
        return time.hrs + ':' + twoDigits(time.mins) + ':' + twoDigits(time.secs);
      } else {
        return time.mins + ':' + twoDigits(time.secs);
      }
    };
  });
