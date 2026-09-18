/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export const mediaBlobUrlIdentifier: any = 'media-blob-url';

export interface MediaBlobUrlAttrs {
	id: string;
	contextId: string;
	clientId?: string;
	collection?: string;
	size?: number;
	name?: string;
	mimeType?: string;
	width?: number;
	height?: number;
	alt?: string;
}

/**
 * @deprecated Use `import { isMediaBlobUrl } from '@atlaskit/media-client'` instead.
 */
export { isMediaBlobUrl } from './isMediaBlobUrl';
/**
 * @deprecated Use `import { getAttrsFromUrl } from '@atlaskit/media-client'` instead.
 */
export { getAttrsFromUrl } from './getAttrsFromUrl';
/**
 * @deprecated Use `import { objectToQueryString } from '@atlaskit/media-client'` instead.
 */
export { objectToQueryString } from './objectToQueryString';
/**
 * @deprecated Use `import { addFileAttrsToUrl } from '@atlaskit/media-client'` instead.
 */
export { addFileAttrsToUrl } from './addFileAttrsToUrl';
