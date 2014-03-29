'use strict';

angular.module('akurraApp')
  .controller('SearchCtrl', function ($scope, $http, SoundCloud, $timeout) {

    var searchTimeout = null;

    $scope.query = {
      value: null
    };

    $scope.searchNow = function () {
      $timeout.cancel(searchTimeout);
      SoundCloud.search($scope.query.value);
    };

    $scope.$watch('query.value', function (newQuery) {
      searchTimeout = $timeout(function () {
        if (newQuery === $scope.query.value) {
          SoundCloud.search(newQuery);
        }
      }, 500);
    });

  });
