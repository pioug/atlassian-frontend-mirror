import { fg } from '@atlaskit/platform-feature-flags/fg';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	SCROLLBAR_HARMONISATION_ATTRIBUTE,
	SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE,
} from '../../src/scrollbar-harmonisation/constants';
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

	it('returns just the base attribute when only the base gate is on', () => {
		passGate('platform_dst_scrollbar_harmonisation');
		failGate('platform_dst_scrollbar_harmonisation_transparent');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
		});
	});

	it('returns the base and transparent attributes when base and transparent gates are on', () => {
		passGate('platform_dst_scrollbar_harmonisation');
		passGate('platform_dst_scrollbar_harmonisation_transparent');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
			[SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE]: '',
		});
	});

	it('the isEnabled override forces the appearance on regardless of the base gate', () => {
		failGate('platform_dst_scrollbar_harmonisation');
		failGate('platform_dst_scrollbar_harmonisation_transparent');

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

	it('treats the base gate as a hard prerequisite, short-circuiting before checking the transparent gate', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({});
		expect(fg).toHaveBeenCalledTimes(1);
	});

	it('keeps the shared base prerequisite when true overrides the appearance', () => {
		failGate('platform_dst_scrollbar_harmonisation');
		passGate('platform_dst_scrollbar_harmonisation_transparent');

		expect(getScrollbarHarmonisationHtmlAttrs(true)).toEqual({
			[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
		});
		expect(fg).toHaveBeenCalledTimes(2);
		expect(fg).toHaveBeenNthCalledWith(1, 'platform_dst_scrollbar_harmonisation');
		expect(fg).toHaveBeenNthCalledWith(2, 'platform_dst_scrollbar_harmonisation_transparent');
	});

	it('preserves the legacy null fallback for JavaScript callers', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		// @ts-expect-error Null is outside the public type but retains its legacy runtime fallback.
		expect(getScrollbarHarmonisationHtmlAttrs(null)).toEqual({});
		expect(fg).toHaveBeenCalledTimes(1);
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
				[SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE]: '',
			},
		},
	])(
		'uses explicit base=$isEnabled and transparent=$isTransparentEnabled without shared evaluation',
		({ isEnabled, isTransparentEnabled, attributes }) => {
			if (isEnabled) {
				failGate('platform_dst_scrollbar_harmonisation');
			} else {
				passGate('platform_dst_scrollbar_harmonisation');
			}
			if (isTransparentEnabled) {
				failGate('platform_dst_scrollbar_harmonisation_transparent');
			} else {
				passGate('platform_dst_scrollbar_harmonisation_transparent');
			}

			expect(fg('platform_dst_scrollbar_harmonisation')).toBe(!isEnabled);
			expect(fg('platform_dst_scrollbar_harmonisation_transparent')).toBe(!isTransparentEnabled);
			expect(getScrollbarHarmonisationHtmlAttrs({ isEnabled, isTransparentEnabled })).toEqual(
				attributes,
			);
			expect(fg).toHaveBeenCalledTimes(2);
		},
	);
});
