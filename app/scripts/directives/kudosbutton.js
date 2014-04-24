'use strict';

angular.module('akurraApp')
  .directive('kudosButton', function () {

    return {
      template: '<span class="kudos-button"></span>',
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        Snap.load('/images/kudos.svg', function (f) {
          element.append(f.node);
        });


      }
    };
  });
