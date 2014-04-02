'use strict';

angular.module('akurraApp')
  .controller('SearchCtrl', function ($scope, SoundCloud, Playlist) {

    $scope.search = {
      query: null
    };

    $scope.soundCloud = SoundCloud;
    $scope.playlist = Playlist;
  });
