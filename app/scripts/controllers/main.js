'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, Playlist, racer) {


    racer.then(function (stuffs) {
      console.log(stuffs);
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
