import { isSafeUrl } from '@atlaskit/adf-schema/is-safe-url';
import { normalizeUrl as normaliseLinkHref } from '@atlaskit/adf-schema/normalize-url';

/**
 * Adds protocol to url if needed.
 */
export function normalizeUrl(url?: string | null): string {
	if (!url) {
		return '';
	}

	if (isSafeUrl(url)) {
		return url;
	}
	return normaliseLinkHref(url);
}
