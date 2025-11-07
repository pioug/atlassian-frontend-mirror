import { THEME_DATA_ATTRIBUTE } from '../../constants';
import { type ThemeIdsWithOverrides } from '../../theme-config';
import { loadAndAppendThemeCss } from '../../utils/theme-loading';

import { verifyDarkColor, verifyLightColor } from './brand-refresh-assertion-helper.mock';

describe('loadAndAppendThemeCss', () => {
	beforeEach(() => {
		// Clear the DOM after each test
		document.getElementsByTagName('html')[0].innerHTML = '';
	});

	async function verifyTheme(theme: ThemeIdsWithOverrides, verifyColor: (content: string) => void) {
		await loadAndAppendThemeCss(theme);
		const lightStyleElement = document.head.querySelector(
			`style[${THEME_DATA_ATTRIBUTE}="${theme}"]`,
		);
		expect(lightStyleElement).not.toBeNull();
		const lightContent = lightStyleElement?.textContent;
		expect(lightContent).toBeDefined();
		expect(lightContent).not.toBeNull();
		verifyColor(lightContent!);
	}

	describe('should add themes to the page when requested', () => {
		it('should add light theme', async () => {
			await verifyTheme('light', verifyLightColor);
		});
		it('should add dark theme', async () => {
			await verifyTheme('dark', verifyDarkColor);
		});
	});

	it('should not add a theme a second time if one is already present on the page', async () => {
		await loadAndAppendThemeCss('dark');
		await loadAndAppendThemeCss('dark');
		const styleElements = document.head.querySelectorAll(`style[${THEME_DATA_ATTRIBUTE}]`);
		expect(styleElements).toHaveLength(1);
	});
});
