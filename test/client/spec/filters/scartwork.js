'use strict';

describe('Filter: scArtwork', function () {

  // load the filter's module
  beforeEach(module('akurraApp'));

  // initialize a new instance of the filter before each test
  var scArtwork;
  beforeEach(inject(function ($filter) {
    scArtwork = $filter('scArtwork');
  }));

  it('should return the input prefixed with "scArtwork filter:"', function () {
    var text = 'angularjs';
    expect(scArtwork(text)).toBe('scArtwork filter: ' + text);
  });

});
