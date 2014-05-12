'use strict';

angular.module('akurraApp')
  .factory('Modal', function ($rootScope) {

    function Modal() {
      $rootScope.modal = this;
      this.isOpen = false;
      this.isLocked = false;
      this.current = null;
    }

    Modal.prototype.close = function (force) {
      if (!this.isLocked || force) {
        this.isOpen = false;
        this.current = null;
        this.isLocked = false;
      }
    };

    Modal.prototype.open = function (name, lock) {

      this.isOpen = true;
      this.current = name;
      lock && this.lock();
    };

    Modal.prototype.lock = function () {
      this.isLocked = true;
    };

    Modal.prototype.unlock = function () {
      this.isLocked = false;
    };

    return new Modal();
  });
