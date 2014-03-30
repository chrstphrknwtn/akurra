'use strict';

angular.module('akurraApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
  .run(function (Keys, SoundCloud, Player) {
    Player.init();

    Keys.get()
      .success(function (keys) {
        SoundCloud.init(keys);
      });
  });
