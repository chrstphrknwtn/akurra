'use strict';

angular.module('akurraApp')
  .controller('PlaylistCtrl', function ($scope, Player, Playlist) {
  	$scope.play = Player;
  	$scope.playlist = Playlist;
  });
