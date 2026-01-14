import { fg } from '@atlaskit/platform-feature-flags';
import getDocument from './getDocument';

const mediaApiPathPrefix = '/media-api';

function getRelativeUrl(absoluteUrl: string) {
	const url = new URL(absoluteUrl);
	return `${url.pathname}${url.search}${url.hash}`;
}

export function isPathBasedEnabled(): boolean {
	const isLocalhost = getDocument()?.location?.hostname === 'localhost';
	return fg('platform_media_path_based_route') && !isLocalhost;
}

export function mapToPathBasedUrl(url: string): string {
	if (isPathBasedEnabled()) {
		const parsedUrl = new URL(url);

		if (!parsedUrl.pathname.startsWith(mediaApiPathPrefix)) {
			parsedUrl.pathname = `${mediaApiPathPrefix}${parsedUrl.pathname}`;
		}
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
	if (!parsedUrl.pathname.startsWith(mediaApiPathPrefix)) {
		parsedUrl.pathname = `${mediaApiPathPrefix}${parsedUrl.pathname}`;
	}
	return parsedUrl;
}
