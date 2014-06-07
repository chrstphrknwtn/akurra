'use strict';

angular.module('akurraApp')
  .directive('akSrc', function (SoundCloud) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        // taken from the inside of ng-src
        attrs.$observe('akSrc', function (value) {
          if (!value) return;
          attrs.$set('src', value);
        });

        element.on('error', function () {
          attrs.$set('src', SoundCloud.generateArtwork());
        });
      }
    };
  });
