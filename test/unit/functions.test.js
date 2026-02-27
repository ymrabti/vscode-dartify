const assert = require('assert');
const { isInteger, isDate, isTimeOfDay, isValidEmail, isValidPhoneNumber } = require('../../src/functions');

suite('Utility Functions Test Suite', () => {
    test('isInteger checks for whole numbers', () => {
        assert.strictEqual(isInteger(4), true);
        assert.strictEqual(isInteger(4.5), false);
        assert.strictEqual(isInteger(0), true);
        assert.strictEqual(isInteger("4"), false);
    });

    test('isDate checks for valid dates', () => {
        assert.strictEqual(isDate("2024-01-01"), true);
        assert.strictEqual(isDate("2024-01-01T12:00:00Z"), true);
        assert.strictEqual(isDate("not a date"), false);
        assert.strictEqual(isDate("12abc"), false);
    });

    test('isTimeOfDay checks for valid simple times', () => {
        assert.strictEqual(isTimeOfDay("12:30"), true);
        assert.strictEqual(isTimeOfDay("11:45"), true);
        assert.strictEqual(isTimeOfDay("not a time"), false);
    });

    if (typeof isValidEmail === 'function') {
        test('isValidEmail checks email format', () => {
            assert.strictEqual(isValidEmail("test@example.com"), true);
            assert.strictEqual(isValidEmail("invalid"), false);
        });
    }
});
