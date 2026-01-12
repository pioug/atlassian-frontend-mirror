import { getDocument } from '@atlaskit/browser-apis';
import { THEME_DATA_ATTRIBUTE, type ThemeIds } from '@atlaskit/tokens';

/**
 * Checks if a theme is mounted in the document head.
 *
 * Eventually this won't be necessary as we'll utilise AppProvider context
 * to track theme loading.
 */
export function isThemeMounted(themeId: ThemeIds) {
	const doc = getDocument();
	if (!doc) {
		return false;
	}
	return doc.head.querySelector(`style[${THEME_DATA_ATTRIBUTE}="${themeId}"]`);
}
