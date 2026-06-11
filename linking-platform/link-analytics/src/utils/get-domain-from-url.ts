import { normalizeUrl } from '@atlaskit/linking-common/url';

export const getDomainFromUrl = (url: string): string | null => {
	try {
		const normalizedUrl = normalizeUrl(url);
		if (!normalizedUrl) {
			return null;
		}

		return new URL(normalizedUrl).hostname;
	} catch {
		return null;
	}
};
