import { isLengthOrPercentage } from '../../spacing';

describe('spacing', () => {
  describe('isLengthOrPercentage()', () => {
    describe('returns true', () => {
      it('when value is an integer without units', () => {
        expect(isLengthOrPercentage('10')).toBe(true);
      });

      it('when value is negative integer', () => {
        expect(isLengthOrPercentage('-10')).toBe(true);
      });

      it('when value is a floating point', () => {
        expect(isLengthOrPercentage('17.6')).toBe(true);
      });

      it('when value is a valid CSS <length> value', () => {
        expect(isLengthOrPercentage('12pt')).toBe(true);
      });

      it('when value is a valid CSS <length> value', () => {
        expect(isLengthOrPercentage('-12vh')).toBe(true);
      });
    });

    describe('returns false', () => {
      it('when value is an empty string', () => {
        expect(isLengthOrPercentage('')).toBe(false);
      });

      it("when value isn't a valid CSS <length> value", () => {
        expect(isLengthOrPercentage('asdf')).toBe(false);
      });

      it('when value is a token', () => {
        expect(isLengthOrPercentage('var(--ds-spacing.100)')).toBe(false);
      });
    });
  });
});
