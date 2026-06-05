import { isSafeUrl, normalizeUrl as normaliseLinkHref } from '@atlaskit/adf-schema';

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
