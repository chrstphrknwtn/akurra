'use strict';

angular.module('akurraApp')
  .controller('PlaybackControlsCtrl', function ($scope, Player) {
    $scope.player = Player;
  });
