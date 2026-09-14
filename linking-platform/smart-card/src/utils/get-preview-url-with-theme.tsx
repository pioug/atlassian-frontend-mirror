import type { ActiveThemeState } from '@atlaskit/tokens/theme-config';
import { themeObjectToString } from '@atlaskit/tokens/theme-object-to-string';

/**
 * Append a theme to the URL if it exists
 * @param previewUrl
 * @param themeState
 */
export const getPreviewUrlWithTheme = (
	previewUrl: string,
	themeState: Partial<ActiveThemeState>,
): string => {
	try {
		const url = new URL(previewUrl);
		url.searchParams.append('themeState', themeObjectToString(themeState));
		return url.href;
	} catch {
		return previewUrl;
	}
};
