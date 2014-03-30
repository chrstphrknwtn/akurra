'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, Playlist) {

    var path = $location.path().substr(1);

    if (!!path) {
      Playlist.createOrJoin(path);
    } else {
      // show how to create playlist or create random playlist?
    }
  });
