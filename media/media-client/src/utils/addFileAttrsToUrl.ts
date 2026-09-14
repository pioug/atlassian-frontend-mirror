import { objectToQueryString } from './objectToQueryString';
import { mediaBlobUrlIdentifier } from './url';
import type { MediaBlobUrlAttrs } from './url';

export const addFileAttrsToUrl = (url: string, fileAttrs: MediaBlobUrlAttrs): string => {
	const isSafari = /^((?!chrome|android).)*safari/i.test((navigator as Navigator).userAgent);
	if (isSafari) {
		return url;
	}
	const mediaIdentifierAttr = {
		[mediaBlobUrlIdentifier]: 'true',
	};
	const mergedAttrs = {
		...mediaIdentifierAttr,
		...fileAttrs,
	};
	const queryAttrs = objectToQueryString(mergedAttrs);

	// we can't use '?' separator for blob url params
	return `${url}#${queryAttrs}`;
};
