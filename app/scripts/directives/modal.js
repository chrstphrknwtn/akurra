'use strict';

angular.module('akurraApp')
  .directive('modal', function ($templateCache, $http, $compile) {

    return {
      template: '<div><div class="modal-overlay" ng-show="modal.isOpen" ng-click="modal.close()">&nbsp;</div><div class="modal" ng-show="modal.isOpen"><div class="modal-content"></div></div></div>',
      restrict: 'E',
      replace: true,
      scope: {
        content: '@'
      },
      controller: function ($scope, Modal) {
        $scope.modal = Modal;
      },
      link: function (scope, element, attrs) {
        attrs.$observe('content', function (newValue) {
          newValue && $http.get('/partials/modals/' + newValue + '-modal.html', {cache: $templateCache})
            .success(function (data) {
              angular.element(element.children().children()[0])
                .html(data);
                // .html($compile(data)(scope));
            });
        });
      }
    };
  });