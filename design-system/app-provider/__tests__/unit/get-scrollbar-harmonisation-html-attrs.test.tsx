import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	SCROLLBAR_HARMONISATION_ATTRIBUTE,
	SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE,
} from '../../src/scrollbar-harmonisation/constants';
import { getScrollbarHarmonisationHtmlAttrs } from '../../src/scrollbar-harmonisation/get-scrollbar-harmonisation-html-attrs';

afterEach(() => {
	jest.resetAllMocks();
});

describe('getScrollbarHarmonisationHtmlAttrs', () => {
	it('returns an empty object when the base gate is off', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({});
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
	});

	it('treats the base gate as a hard prerequisite, short-circuiting before checking the transparent gate', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		expect(getScrollbarHarmonisationHtmlAttrs()).toEqual({});
	});
});
