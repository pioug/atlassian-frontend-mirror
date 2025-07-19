import { getSpacingToken, isLengthOrPercentage } from '../../spacing';

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

	describe('getSpacingToken()', () => {
		describe('returns token for valid spacing values', () => {
			it('when value is unitless zero', () => {
				expect(getSpacingToken('0')).toBe('var(--ds-space-0, 0)');
			});

			it('when value is zero with px', () => {
				expect(getSpacingToken('0px')).toBe('var(--ds-space-0, 0px)');
			});

			it('when value is a valid pixel spacing value', () => {
				expect(getSpacingToken('8px')).toBe('var(--ds-space-100, 8px)');
			});

			it('when value is a valid rem spacing value', () => {
				expect(getSpacingToken('0.5rem')).toBe('var(--ds-space-100, 0.5rem)');
			});

			it('when value is a valid em spacing value', () => {
				expect(getSpacingToken('0.5em')).toBe('var(--ds-space-100, 0.5em)');
			});

			it('when value is a valid pixel spacing value', () => {
				expect(getSpacingToken('-8px')).toBe('var(--ds-space-negative-100, -8px)');
			});

			it('when value is a valid rem spacing value', () => {
				expect(getSpacingToken('-0.5rem')).toBe('var(--ds-space-negative-100, -0.5rem)');
			});
		});

		describe('returns null for invalid spacing values', () => {
			it('when value is an empty string', () => {
				expect(getSpacingToken('')).toBe(null);
			});

			it('when value is not a spacing token', () => {
				expect(getSpacingToken('invalid')).toBe(null);
			});

			it('when value is a non-spacing pixel value', () => {
				expect(getSpacingToken('7px')).toBe(null);
			});

			it('when value is a non-spacing rem value', () => {
				expect(getSpacingToken('0.4rem')).toBe(null);
			});

			it('when value is a non-zero unitless number', () => {
				expect(getSpacingToken('5')).toBe(null);
			});
		});
	});
});
