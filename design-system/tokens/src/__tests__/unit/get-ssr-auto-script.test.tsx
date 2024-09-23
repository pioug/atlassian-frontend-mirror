import __noop from '@atlaskit/ds-lib/noop';
import { ffTest } from '@atlassian/feature-flags-test-utils';

// This import is just to get types
import { COLOR_MODE_ATTRIBUTE, CONTRAST_MODE_ATTRIBUTE } from '../../constants';
import type * as getSSRAutoScriptTypes from '../../get-ssr-auto-script';

// Mock window.matchMedia before importing setGlobalTheme
const matchMediaObject = {
	matches: false,
	media: '',
	onchange: null,
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
	dispatchEvent: jest.fn(),
};

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((_) => {
		return matchMediaObject;
	}),
});

// Imported using `require` to allow us to mock matchMedia before importing
const {
	default: getSSRAutoScript,
}: typeof getSSRAutoScriptTypes = require('../../get-ssr-auto-script');

/**
 * Set the result of a dark mode media query
 */
function setMatchMedia(matchesDark: boolean) {
	matchMediaObject.matches = matchesDark;
}

/**
 * Cleans the DOM by clearing the html tag and re-setting the media query
 */
const cleanDOM = () => {
	// Clear the DOM after each test
	const html = document.documentElement;

	// Remove attributes on html
	[...html.attributes].forEach((attr) => html.removeAttribute(attr.name));

	html.innerHTML = '';
	setMatchMedia(false);
};

describe('getSSRAutoScript', () => {
	beforeEach(cleanDOM);
	it('returns undefined when colorMode and contrastMode is not automatically set', async () => {
		const result = getSSRAutoScript('light', 'no-preference');
		expect(result).toBeUndefined();
	});

	it('returns a script that correctly sets the data-color-mode attribute based on the system theme', async () => {
		// Get the SSR auto script
		const result = getSSRAutoScript('auto', 'no-preference');
		expect(result).toBeDefined();

		// Execute the returned script
		const script = document.createElement('script');
		script.innerHTML = result || '';
		document.head.appendChild(script);

		const el = document.querySelector(`[${COLOR_MODE_ATTRIBUTE}]`);

		// Check that the data-color-mode attribute has been set as expected to "light"
		expect(el?.getAttribute(COLOR_MODE_ATTRIBUTE)).toBe('light');

		// Check that the data-contrast-mode attribute has not been set
		expect(el?.hasAttribute(CONTRAST_MODE_ATTRIBUTE)).toBe(false);
	});

	describe('returns a script that correctly sets the data-contrast-mode attribute based on the system color preference', () => {
		ffTest(
			'platform_increased-contrast-themes',
			async () => {
				// Get the SSR auto script
				const result = getSSRAutoScript('light', 'auto');
				expect(result).toBeDefined();

				// Execute the returned script
				const script = document.createElement('script');
				script.innerHTML = result || '';
				document.head.appendChild(script);

				const el = document.querySelector(`[${CONTRAST_MODE_ATTRIBUTE}]`);

				// Check that the data-contrast-mode attribute has been set as expected to "no-preference"
				expect(el?.getAttribute(CONTRAST_MODE_ATTRIBUTE)).toBe('no-preference');

				// Check that the data-color-mode attribute has not been set
				expect(el?.hasAttribute(COLOR_MODE_ATTRIBUTE)).toBe(false);
			},
			async () => {
				// Get the SSR auto script
				const result = getSSRAutoScript('light', 'auto');
				expect(result).toBeDefined();

				// Execute the returned script
				const script = document.createElement('script');
				script.innerHTML = result || '';
				document.head.appendChild(script);

				// Check that the data-contrast-mode attribute has not been set".
				expect(document.documentElement?.hasAttribute(CONTRAST_MODE_ATTRIBUTE)).toBe(false);
			},
		);
	});
});
