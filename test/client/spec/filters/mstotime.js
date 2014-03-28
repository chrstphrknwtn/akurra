'use strict';

describe('Filter: msToTime', function () {

  // load the filter's module
  beforeEach(module('akurraApp'));

  // initialize a new instance of the filter before each test
  var msToTime;
  beforeEach(inject(function ($filter) {
    msToTime = $filter('msToTime');
  }));

  it('should return the input prefixed with "msToTime filter:"', function () {
    var text = 'angularjs';
    expect(msToTime(text)).toBe('msToTime filter: ' + text);
  });

});
