'use strict';

angular.module('akurraApp')
  .directive('akSrc', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        attrs.$observe('akSrc', function (value) {
          if (!value) return;
          attrs.$set('src', value);
        });

        element.on('error', function () {
          debugger;
        });
      }
    };
  });
