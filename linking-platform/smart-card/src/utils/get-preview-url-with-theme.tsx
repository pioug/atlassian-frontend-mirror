import type { ActiveThemeState } from '@atlaskit/tokens/theme-config';
import { themeObjectToString } from '@atlaskit/tokens/theme-object-to-string';

type EmbedContext = {
	hostProduct?: string;
	themeState?: Partial<ActiveThemeState>;
};

export const getPreviewUrlWithEmbedContext = (
	previewUrl: string,
	{ hostProduct, themeState }: EmbedContext,
): string => {
	try {
		const url = new URL(previewUrl);

		if (themeState) {
			url.searchParams.append('themeState', themeObjectToString(themeState));
		}

		if (hostProduct) {
			url.searchParams.set('hostProduct', hostProduct);
		}

		return url.href;
	} catch {
		return previewUrl;
	}
};

/**
 * Append a theme to the URL if it exists
 * @param previewUrl
 * @param themeState
 */
export const getPreviewUrlWithTheme = (
	previewUrl: string,
	themeState: Partial<ActiveThemeState>,
): string => getPreviewUrlWithEmbedContext(previewUrl, { themeState });
