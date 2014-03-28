'use strict';

describe('Service: keys', function () {

  // load the service's module
  beforeEach(module('akurraApp'));

  // instantiate service
  var keys;
  beforeEach(inject(function (_keys_) {
    keys = _keys_;
  }));

  it('should do something', function () {
    expect(!!keys).toBe(true);
  });

});
