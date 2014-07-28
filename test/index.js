var aleaRandom = require('../');
var test = require('tape');
var isFunction = require('lodash.isfunction');
var map = require('lodash.map');
var uniq = require('lodash.uniq');
var every = require('lodash.every');
var some = require('lodash.some');
var constant = require('lodash.constant');

var array = Array(1000);

test('exports a function', function(t) {
  t.plan(1);
  t.ok(isFunction(aleaRandom));
});

test('returns `0` or `1` when arguments are not provided', function(t) {
  t.plan(1);
  var actual = map(array, function() {
    return aleaRandom();
  });
  t.deepEqual(uniq(actual).sort(), [0, 1]);
});

test('supports not providing a `max` argument', function(t) {
  t.plan(1);
  t.ok(some(array, function() {
    return aleaRandom(5) !== 5;
  }));
});

test('supports large integer values', function(t) {
  t.plan(2);
  var min = Math.pow(2, 31);
  var max = Math.pow(2, 62);
  t.ok(every(array, function() {
    return aleaRandom(min, max) >= min;
  }));
  t.ok(some(array, function() {
    return aleaRandom(Number.MAX_VALUE) > 0;
  }));
});

test('coerces arguments to numbers', function(t) {
  t.plan(1);
  t.equal(aleaRandom('1', '1'), 1);
});

test('supports floats', function(t) {
  t.plan(2);
  var min = 1.5;
  var max = 1.6;
  var actual = aleaRandom(min, max);
  t.ok(actual % 1);
  t.ok(actual >= min && actual <= max);
});

test('supports `floating` argument', function(t) {
  t.plan(3);
  var actual = aleaRandom(true);
  t.ok(actual % 1 && actual >= 0 && actual <= 1);

  actual = aleaRandom(2, true);
  t.ok(actual % 1 && actual >= 0 && actual <= 2);

  actual = aleaRandom(2, 4, true);
  t.ok(actual % 1 && actual >= 2 && actual <= 4);
});

test('works when used as a callback for `map`', function(t) {
  t.plan(1);
  var array = [1, 2, 3];
  var actual = map(array, aleaRandom);
  var expected = map(array, constant(true));

  actual = map(actual, function(result, index) {
    return result >= 0 && result <= array[index] && (result % 1) == 0;
  });

  t.deepEqual(actual, expected);
});