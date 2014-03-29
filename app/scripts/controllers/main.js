'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, $filter, Playlist, SoundCloud, Player, Keys, $timeout) {

    Player.init();

    Keys.get()
      .success(function (keys) {
        SoundCloud.init(keys);
      });

    var path = $location.path().substr(1);

    if (!!path) {
      Playlist.createOrJoin(path);
    } else {
      // show how to create playlist or create random playlist?
    }


    $scope.searchTimeout = null;
    $scope.searchNow = function () {
      $timeout.cancel($scope.searchTimeout);
      SoundCloud.search($scope.query);
    };

    $scope.$watch('query', function (newQuery) {
      $scope.searchTimeout = $timeout(function () {
        if (newQuery === $scope.query) {
          SoundCloud.search(newQuery);
        }
      }, 500);
    });

    $scope.query = null;
    $scope.soundCloud = SoundCloud;
    $scope.player = Player;
    $scope.playlist = Playlist;
  });
