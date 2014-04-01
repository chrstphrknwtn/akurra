'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, Playlist, Racer) {


    Racer.then(function (stuffs) {
      $scope.entries = stuffs.get('entries');

      $scope.add = function () {
        stuffs.add('entries', { text: $scope.newInput, done: false });
      };

      $scope.save = function (entry) {
        stuffs.set('entries.' + entry.id + '.done', entry.done);
        return false;
      };
    });

    var path = $location.path().substr(1);

    if (!!path) {
      Playlist.createOrJoin(path);
    } else {
      // show how to create playlist or create random playlist?
    }
  });
