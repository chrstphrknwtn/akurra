'use strict';

angular.module('akurraApp')
  .directive('volumeButton', function ($timeout, Player) {
    var svgIconConfig = {
      volume : {
        url : '/images/volume.svg',
        animation : [
          {
            el : 'path:nth-child(1)',
            animProperties : {
              from : { val : '{"transform" : "t-10 0 s0 32 32"}' },
              to : { val : '{"transform" : "t0 0 s1 32 32", "opacity" : 1}', before : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : 0.5 }
            }
          },
          {
            el : 'path:nth-child(2)',
            animProperties : {
              from : { val : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : 0.25 },
              to : { val : '{"transform" : "t0 0 s1 32 32", "opacity" : 1}', before : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : 0.25 }
            }
          },
          {
            el : 'path:nth-child(3)',
            animProperties : {
              from : { val : '{"transform" : "t-10 0 s0 32 32"}', delayFactor : 0.5 },
              to : { val : '{"transform" : "t0 0 s1 32 32", "opacity" : 1}', before : '{"transform" : "t-10 0 s0 32 32"}' }
            }
          }
        ]
      }
    };
    return {
      template: '<span class="volume-button" data-icon-name="volume"></span>',
      replace: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var icon = new svgIcon(element[0], svgIconConfig ); // jshint ignore:line

        Player.once('startedPlayback', function () {
          $timeout(function () {
            icon.toggle(true);
          }, 300);
        });

        element.on('click', function () {
          Player.toggleMute();
        });
      }
    };
  });
