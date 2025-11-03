import { fg } from '@atlaskit/platform-feature-flags';
import getDocument from './getDocument';

function getRelativeUrl(absoluteUrl: string) {
	const url = new URL(absoluteUrl);
	return `${url.pathname}${url.search}${url.hash}`;
}

export function isPathBasedEnabled(): boolean {
	const isLocalhost = getDocument()?.location?.hostname === 'localhost';
	return fg('platform_media_path_based_route') && !isLocalhost;
}

export function mapToPathBasedUrl(url: string) {
	if (isPathBasedEnabled()) {
		const parsedUrl = new URL(url);

		parsedUrl.pathname = `/media-api${parsedUrl.pathname}`;
		const location = getDocument()?.location;

		// in this case we are most likely in SSR / a non browser environment so just return a relative URL
		if (!location) {
			return getRelativeUrl(parsedUrl.toString());
		}

		parsedUrl.host = location.host;
		return parsedUrl.toString();
	}

	return url;
}

export function mapRetryUrlToPathBasedUrl(url: string) {
	const parsedUrl = new URL(url);
	parsedUrl.host = getDocument()?.location.host ?? '';

	// remove CDN from the URL for retry if it exists
	const pathname = parsedUrl.pathname;
	if (pathname.endsWith('/cdn')) {
		parsedUrl.pathname = pathname.replace('/cdn', '');
	}
	parsedUrl.pathname = `/media-api${parsedUrl.pathname}`;
	return parsedUrl;
}
