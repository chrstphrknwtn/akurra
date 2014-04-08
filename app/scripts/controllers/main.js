'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, Playlist, SoundCloud, Player) {

    Playlist.createOrJoin('entries')
      .then(function () {
        // do things
    });

    $scope.search = {
      query: null
    };

    $scope.soundCloud = SoundCloud;
    $scope.playlist = Playlist;
    $scope.player = Player;
  });
