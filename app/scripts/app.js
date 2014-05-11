'use strict';

angular.module('akurraApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'racer.js'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/:playlistId?', {
        reloadOnSearch: false,
        controller: 'MainCtrl',
        templateUrl: 'partials/main',
        redirectTo: function (params) {
          // redirect home if playlistId contains anything but letters, numbers, underscores or hyphens
          return /^[0-9]|[^0-9a-z-]/i.test(params.playlistId) ? '/' : params.playlistId;
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
  .run(function (Keys, SoundCloud, Player, Playlist, User) {

    User.init();

    Player.init();

    Keys.get()
      .success(function (keys) {
        SoundCloud.init(keys);
      });
  });
