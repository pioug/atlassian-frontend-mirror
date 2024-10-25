import { roundEpsilon } from '../../index';

describe('round number', () => {
	describe('roundEpsilon', () => {
		it('roundEpsilon should use default decimal places when not provided', () => {
			const roundedNumber = roundEpsilon(456.4893);

			expect(roundedNumber).toEqual(456.489);
		});

		it('roundEpsilon should consider provided decimal places', () => {
			const roundedNumber = roundEpsilon(456.4815, 2);

			expect(roundedNumber).toEqual(456.48);
		});

		it('roundEpsilon should not add trailing zeros', () => {
			const roundedNumber = roundEpsilon(456.0);

			expect(roundedNumber).toEqual(456);
		});
	});
});
