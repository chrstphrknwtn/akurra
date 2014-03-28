'use strict';

describe('Service: SoundCloud', function () {

  // load the service's module
  beforeEach(module('akurraApp'));

  // instantiate service
  var SoundCloud;
  beforeEach(inject(function (_SoundCloud_) {
    SoundCloud = _SoundCloud_;
  }));

  it('should do something', function () {
    expect(!!SoundCloud).toBe(true);
  });

});
