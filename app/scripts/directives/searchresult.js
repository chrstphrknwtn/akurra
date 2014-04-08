'use strict';

angular.module('akurraApp')
  .directive('searchResult', function () {
    return {
      templateUrl: '../../views/partials/search-result-template.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });