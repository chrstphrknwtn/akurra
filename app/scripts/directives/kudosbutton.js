'use strict';

angular.module('akurraApp')
  .directive('kudosButton', function () {

    var heart;
    var scale = 0.5;

    function beat() {
      if (scale < 0.99) {
        scale += 0.1;
      } else {
        scale = 1;
      }

      var beatMatrix = new Snap.Matrix();
      beatMatrix.scale(scale, scale, 32, 40);

      heart.animate({transform: beatMatrix}, 800, mina.bounce);
    }

    return {
      template: '<span class="kudos-button"></span>',
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var startMatrix = new Snap.Matrix();
        startMatrix.scale(scale, scale, 32, 40);

        var svg = new Snap(64, 64);
        svg.attr('viewBox', '0 0 64 64');
        element.append(svg.node);

        Snap.load('/images/kudos.svg', function (f) {
          heart = f.select('#heart');
          svg.append(heart);
          heart.transform(startMatrix);
        });

        element.on('click', function () {
          beat();
          heart.animate({fill: '#CC0000'}, 800);
        });
      }
    };
  });
