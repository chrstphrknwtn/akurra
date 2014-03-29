'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, Keys, Playlist, SoundCloud, Player) {

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

    $scope.soundCloud = SoundCloud;
    $scope.player = Player;
    $scope.playlist = Playlist;
  });
