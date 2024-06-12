import { SMALLEST_BREAKPOINT, UNSAFE_BREAKPOINTS_ORDERED_LIST } from '../../constants';

describe('constants', () => {
	it('UNSAFE_BREAKPOINTS_ORDERED_LIST are in the expected order', () => {
		expect(UNSAFE_BREAKPOINTS_ORDERED_LIST).toEqual(['xxs', 'xs', 'sm', 'md', 'lg', 'xl']);
	});

	describe('SMALLEST_BREAKPOINT', () => {
		it('is the expected value', () => {
			expect(SMALLEST_BREAKPOINT).toBe('xxs');
		});
	});
});
