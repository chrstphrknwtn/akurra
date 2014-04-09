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
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: 'partials/main'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
  .run(function (Keys, SoundCloud, Player, Playlist) {
    Player.init();

    Keys.get()
      .success(function (keys) {
        SoundCloud.init(keys);
      });
  });
