import { CUSTOM_THEME_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../constants';
import { type ThemeColorModes, type ThemeOptionsSchema } from '../theme-config';

import { hash } from './hash';

type ThemeAttributeId = 'light' | 'dark';

export function findMissingCustomStyleElements(
	UNSAFE_themeOptions: ThemeOptionsSchema,
	mode: ThemeColorModes,
): ThemeAttributeId[] {
	const optionString = JSON.stringify(UNSAFE_themeOptions);
	const uniqueId = hash(optionString);

	const attrOfMissingCustomStyles: ThemeAttributeId[] = [];
	(mode === 'auto' ? ['light', 'dark'] : [mode]).forEach((themeId) => {
		const element = document.head.querySelector(
			`style[${CUSTOM_THEME_ATTRIBUTE}="${uniqueId}"][${THEME_DATA_ATTRIBUTE}="${themeId}"]`,
		);
		if (element) {
			// Append the existing custom styles to take precedence over others
			document.head.appendChild(element);
		} else {
			attrOfMissingCustomStyles.push(themeId as ThemeAttributeId);
		}
	});

	return attrOfMissingCustomStyles;
}
