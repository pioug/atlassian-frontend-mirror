import __noop from '@atlaskit/ds-lib/noop';

import {
	COLOR_MODE_ATTRIBUTE,
	CUSTOM_THEME_ATTRIBUTE,
	THEME_DATA_ATTRIBUTE,
} from '../../constants';
import getThemeHtmlAttrs from '../../get-theme-html-attrs';
import { type ThemeOptionsSchema } from '../../theme-config';
import { hash } from '../../utils/hash';

const UNSAFE_themeOptions: ThemeOptionsSchema = {
	brandColor: '#ff0000',
};

const customStyleHashId = hash(JSON.stringify(UNSAFE_themeOptions));

describe('getThemeHtmlAttrs', () => {
	it('returns a Record of html attributes when given valid theme state', () => {
		const result = getThemeHtmlAttrs({
			colorMode: 'auto',
			dark: 'dark',
			light: 'light',
			spacing: 'spacing',
			typography: 'typography',
			UNSAFE_themeOptions,
		});

		expect(result).toHaveProperty(
			THEME_DATA_ATTRIBUTE,
			'dark:dark light:light spacing:spacing typography:typography',
		);

		// SSR doesn't check the media query
		expect(result).toHaveProperty(COLOR_MODE_ATTRIBUTE, 'light');
		expect(result).toHaveProperty(CUSTOM_THEME_ATTRIBUTE, customStyleHashId);
	});
});
