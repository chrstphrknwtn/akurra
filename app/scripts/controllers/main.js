'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $collection, $location, $filter, Playlist, SoundCloud, Player, Keys) {
    Player.init();
    Keys.get(function (keys) {
      SoundCloud.init(keys);
    });

    var path = $location.path().substr(1);

    if (!!path) {
      Playlist.createOrJoin(path);
    } else {
      // show how to create playlist or create random playlist?
    }

    $scope.soundCloud = SoundCloud;
    $scope.player = Player;
    $scope.playlist = Playlist;
  });
