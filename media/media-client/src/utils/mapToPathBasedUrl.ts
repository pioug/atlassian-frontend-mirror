import getDocument from './getDocument';
import { isPathBasedEnabled } from './isPathBasedEnabled';
import { mediaApiPathPrefix } from './pathBasedUrl';

function getRelativeUrl(absoluteUrl: string) {
	const url = new URL(absoluteUrl);
	return `${url.pathname}${url.search}${url.hash}`;
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
