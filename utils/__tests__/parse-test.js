const parse = require('../parse.js');
const signals = require('./signals.json');

test('parseSignal returns true if signals are different', () => {
    expect(parse.parseSignal(signals[0], signals[1], false)).toBe(true);
});

test('parseSignal returns true if signals are different', () => {
    expect(parse.parseSignal(signals[0], signals[0], false)).toBe(false);
});
