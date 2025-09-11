import { fg } from '@atlaskit/platform-feature-flags';
import getDocument from './getDocument';

export function mapToPathBasedUrl(url: string) {
	if (fg('platform_media_path_based_route')) {
		const parsedUrl = new URL(url);

		parsedUrl.host = getDocument()?.location.host ?? parsedUrl.host;
		parsedUrl.pathname = `/media-api${parsedUrl.pathname}`;
		return parsedUrl.toString();
	}

	return url;
}

export function mapRetryUrlToPathBasedUrl(url: string) {
	const parsedUrl = new URL(url);
	parsedUrl.host = getDocument()?.location.host ?? parsedUrl.host;

	// remove CDN from the URL for retry if it exists
	const pathname = parsedUrl.pathname;
	if (pathname.endsWith('/cdn')) {
		parsedUrl.pathname = pathname.replace('/cdn', '');
	}
	parsedUrl.pathname = `/media-api${parsedUrl.pathname}`;
	return parsedUrl;
}
