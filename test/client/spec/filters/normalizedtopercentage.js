'use strict';

describe('Filter: normalizedToPercentage', function () {

  // load the filter's module
  beforeEach(module('akurraApp'));

  // initialize a new instance of the filter before each test
  var normalizedToPercentage;
  beforeEach(inject(function ($filter) {
    normalizedToPercentage = $filter('normalizedToPercentage');
  }));

  it('should return the input prefixed with "normalizedToPercentage filter:"', function () {
    var text = 'angularjs';
    expect(normalizedToPercentage(text)).toBe('normalizedToPercentage filter: ' + text);
  });

});
