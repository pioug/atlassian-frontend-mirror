import { getPopupAxisSizes } from '../../internal/get-popup-axis-sizes';

describe('getPopupAxisSizes()', () => {
	// The full truth table: both adapters read this one mapping, and
	// `shouldFitContainer` has to win the inline axis when both props are set.
	it.each([
		[
			{ shouldFitContainer: false, shouldFitViewport: false },
			{ inlineSize: 'content', blockSize: 'content' },
		],
		[
			{ shouldFitContainer: true, shouldFitViewport: false },
			{ inlineSize: 'match-anchor', blockSize: 'content' },
		],
		[
			{ shouldFitContainer: false, shouldFitViewport: true },
			{ inlineSize: 'max-available', blockSize: 'max-available' },
		],
		[
			{ shouldFitContainer: true, shouldFitViewport: true },
			{ inlineSize: 'match-anchor', blockSize: 'max-available' },
		],
	])('maps %o to %o', (props, expected) => {
		expect(getPopupAxisSizes(props)).toEqual(expected);
	});
});
