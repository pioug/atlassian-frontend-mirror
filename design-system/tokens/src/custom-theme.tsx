import { getCustomThemeStyles } from './get-custom-theme-styles';
import { type ThemeOptionsSchema, type ThemeState } from './theme-config';
import { limitSizeOfCustomStyleElements } from './utils/limit-size-of-custom-style-elements';

export const CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = 10;

export function loadAndAppendCustomThemeCss(
	themeState: Partial<ThemeState> & {
		UNSAFE_themeOptions: ThemeOptionsSchema;
	},
): void {
	const themes = getCustomThemeStyles(themeState);

	limitSizeOfCustomStyleElements(CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD);
	themes.map((theme) => {
		const styleTag = document.createElement('style');
		document.head.appendChild(styleTag);
		(styleTag as HTMLStyleElement).dataset.theme = theme.attrs['data-theme'];
		(styleTag as HTMLStyleElement).dataset.customTheme = theme.attrs['data-custom-theme'];
		styleTag.textContent = theme.css;
	});
}

export { getCustomThemeStyles } from './get-custom-theme-styles';
