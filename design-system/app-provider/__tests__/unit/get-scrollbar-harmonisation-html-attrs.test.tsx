import { fg } from '@atlaskit/platform-feature-flags/fg';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { SCROLLBAR_HARMONISATION_ATTRIBUTE } from '../../src/scrollbar-harmonisation/constants';
import getDefaultHtmlAttrs, {
	getScrollbarHarmonisationHtmlAttrs,
} from '../../src/scrollbar-harmonisation/get-scrollbar-harmonisation-html-attrs';

afterEach(() => {
	jest.resetAllMocks();
});

describe('getScrollbarHarmonisationHtmlAttrs', () => {
	it('returns an empty object when the base gate is off', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({});
		expect(fg).toHaveBeenCalledTimes(1);
		expect(fg).toHaveBeenCalledWith('platform_dst_scrollbar_harmonisation');
	});

	it('returns only the main attribute when the base gate is on', () => {
		passGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
		});
	});

	it('returns only the base attribute without evaluating the obsolete transparent gate', () => {
		passGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
		});
		expect(fg).not.toHaveBeenCalledWith('platform_dst_scrollbar_harmonisation_transparent');
	});

	it('the isEnabled override forces the appearance on regardless of the base gate', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs(true)).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
		});
	});

	it('the isEnabled override forces the appearance off regardless of the base gate', () => {
		passGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs(false)).toEqual({});
		expect(fg).toHaveBeenCalledTimes(1);
		expect(fg).toHaveBeenCalledWith('platform_dst_scrollbar_harmonisation');
	});

	it('evaluates only the base gate when resolving default appearance', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({});
		expect(fg).toHaveBeenCalledTimes(1);
	});

	it('does not evaluate the obsolete transparent gate for an enabled override', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs(true)).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
		});
		expect(fg).toHaveBeenCalledTimes(1);
		expect(fg).not.toHaveBeenCalledWith('platform_dst_scrollbar_harmonisation_transparent');
	});

	it('preserves the legacy null fallback for JavaScript callers', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		// @ts-expect-error Null is outside the public type but retains its legacy runtime fallback.
		expect(getScrollbarHarmonisationHtmlAttrs(null)).toEqual({});
		expect(fg).toHaveBeenCalledTimes(1);
	});

	it('accepts a product-resolved base value without a transparent option', () => {
		expect(getScrollbarHarmonisationHtmlAttrs({ isEnabled: true })).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
		});
		expect(fg).not.toHaveBeenCalled();
	});

	it('keeps the default and named exports identical', () => {
		expect(getDefaultHtmlAttrs).toBe(getScrollbarHarmonisationHtmlAttrs);
	});

	it.each([
		{ isEnabled: false, isTransparentEnabled: false, attributes: {} },
		{ isEnabled: false, isTransparentEnabled: true, attributes: {} },
		{
			isEnabled: true,
			isTransparentEnabled: false,
			attributes: { [SCROLLBAR_HARMONISATION_ATTRIBUTE]: '' },
		},
		{
			isEnabled: true,
			isTransparentEnabled: true,
			attributes: {
				[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
			},
		},
	])(
		'uses explicit base=$isEnabled and transparent=$isTransparentEnabled without shared evaluation',
		({ isEnabled, isTransparentEnabled, attributes }) => {
			expect(getScrollbarHarmonisationHtmlAttrs({ isEnabled, isTransparentEnabled })).toEqual(
				attributes,
			);
			expect(fg).not.toHaveBeenCalled();
		},
	);
});
