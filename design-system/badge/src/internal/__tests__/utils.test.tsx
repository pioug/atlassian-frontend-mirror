import { formatValue } from '../utils';

describe('#utils', () => {
  describe('#formatValue', () => {
    it('should get "0" by default', () => {
      expect(formatValue()).toBe('0');
    });

    it.each([0, 100, 12.34])(
      'should get positive numeric value (value=%p)',
      (value) => {
        expect(formatValue(value, value)).toBe(value.toString());
      },
    );

    it.each([-1, -100, -Infinity])(
      'should clamp negative numeric value (value=%p, expected="0")',
      (value) => {
        expect(formatValue(value)).toBe('0');
      },
    );

    it.each([
      ['-100', '0'],
      ['0', '0'],
      ['abc', 'abc'],
      ['+100,000.333', '+100,000.333'],
      ['100000.333', '100000.333'],
    ])(
      'should interpret value as numbers where possible (value=%p, expected=%p)',
      (value, expected) => {
        expect(formatValue(value)).toBe(expected);
      },
    );

    it('should not have a max by default', () => {
      expect(formatValue(Infinity)).toBe('∞');
    });

    it.each([
      [10, 100, '10'],
      [1000, 100, '100+'],
    ])(
      'should respect positive values of max (value=%p, max=%p, expected=%p)',
      (value, max, expected) => {
        expect(formatValue(value, max)).toBe(expected);
      },
    );

    it.each([
      [0, -1, '0'],
      [10, -10, '10'],
      [-20, -10, '0'],
      [100, 0, '100'],
      [Infinity, -100, '∞'],
    ])(
      'should ignore non-positive values for max (value=%p, max=%p, expected=%p)',
      (value, max, expected) => {
        expect(formatValue(value, max)).toBe(expected);
      },
    );

    it.each([0, -100, -Infinity])(
      'should clamp negative numeric values (value=%p, expected="0")',
      (value) => {
        expect(formatValue(value)).toBe('0');
      },
    );

    it.each([
      [Infinity, -100, '∞'],
      [1000, Infinity, '1000'],
      [Infinity, 100, '100+'],
      [Infinity, Infinity, '∞'],
    ])(
      'should handle Infinity (value=%p, max=%p, expected=%p)',
      (value, max, expected) => {
        expect(formatValue(value, max)).toBe(expected);
      },
    );
  });
});
