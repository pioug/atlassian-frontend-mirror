import type { MediaBlobUrlAttrs } from './url';

const getNumberFromParams = (
	params: URLSearchParams,
	name: keyof MediaBlobUrlAttrs,
): number | undefined => {
	const value = params.get(name);

	return typeof value === 'string' && !isNaN(parseInt(value)) ? parseInt(value) : undefined;
};

const getStringFromParams = (
	params: URLSearchParams,
	name: keyof MediaBlobUrlAttrs,
): string | undefined => {
	const value = params.get(name);
	if (!value) {
		return;
	}

	return decodeURIComponent(value);
};

export const getAttrsFromUrl = (blobUrl: string): MediaBlobUrlAttrs | undefined => {
	const url = new URL(blobUrl);
	const hash = url.hash.replace('#', '');
	const params = new URLSearchParams(hash);
	const id = params.get('id');
	const contextId = params.get('contextId');
	const clientId = params.get('clientId');
	// check if we have the required params (clientId is optional for backwards compatibility)
	if (!id || !contextId) {
		return;
	}

	return {
		id,
		contextId,
		clientId: clientId || undefined,
		collection: getStringFromParams(params, 'collection'),
		alt: getStringFromParams(params, 'alt'),
		height: getNumberFromParams(params, 'height'),
		width: getNumberFromParams(params, 'width'),
		size: getNumberFromParams(params, 'size'),
		name: getStringFromParams(params, 'name'),
		mimeType: getStringFromParams(params, 'mimeType'),
	};
};
