'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, Playlist, SoundCloud, Player, $routeParams) {

    Playlist.createOrJoin($routeParams.playlistId || 'default');

    $scope.doSearch = function (query) {
      SoundCloud.search(query);
      $location.search('q', !!query ? query : null);
      $scope.search.query = query;
    };

    $scope.search = {
      query: $location.search().q
    };

    if ($scope.search.query) {
      $scope.doSearch($scope.search.query);
    }

    $scope.soundCloud = SoundCloud;
    $scope.playlist = Playlist;
    $scope.player = Player;
  });
