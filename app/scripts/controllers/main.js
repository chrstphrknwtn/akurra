'use strict';

angular.module('akurraApp')
  .controller('MainCtrl', function ($scope, $location, Playlist) {

    Playlist.createOrJoin('entries')
      .then(function () {
        // do things
    });
  });
