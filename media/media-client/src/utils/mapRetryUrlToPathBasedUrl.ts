import getDocument from './getDocument';
import { mediaApiPathPrefix } from './pathBasedUrl';

export function mapRetryUrlToPathBasedUrl(url: string): URL {
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
