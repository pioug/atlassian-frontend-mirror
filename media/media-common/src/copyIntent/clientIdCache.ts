/**
 * Cache for storing fileId to clientId mapping during paste operations.
 * This avoids the need to store clientId in ADF schema attributes.
 *
 * Used for cross-client copy/paste scenarios
 *
 * Entries persist across reads to support multiple pastes of the same content.
 * An LRU-style max size limit guards against unbounded growth — the oldest entry
 * is evicted whenever the cache exceeds CLIENT_ID_CACHE_MAX_SIZE.
 */

const CLIENT_ID_CACHE_MAX_SIZE = 20;

const clientIdCache = new Map<string, string>();

export const setClientIdForFile = (fileId: string, clientId: string): void => {
	clientIdCache.set(fileId, clientId);

	// Evict oldest entries if cache exceeds max size
	if (clientIdCache.size > CLIENT_ID_CACHE_MAX_SIZE) {
		const oldestKey = clientIdCache.keys().next().value;
		if (oldestKey !== undefined) {
			clientIdCache.delete(oldestKey);
		}
	}
};

/**
 * Retrieve clientId for a file ID (called during copyFile).
 * Returns undefined if not found.
 * Entries are NOT consumed on read — the same file can be pasted multiple times.
 */
export const getClientIdForFile = (fileId: string): string | undefined => {
	return clientIdCache.get(fileId);
};

/**
 * Clear all cached clientIds (for testing purposes)
 */
export const clearClientIdCache = (): void => {
	clientIdCache.clear();
};

/**
 * Used to store fileId to clientId mappings on paste of Editor PM Node
 *
 * Handles two sources of pasted HTML:
 *
 * 1. Editor-to-editor copy: the clientId is stored as a `data-client-id` attribute
 *    directly on the `<div data-node-type="media">` element, written by the editor's
 *    clipboard serialiser.
 *
 * 2. Renderer-to-editor copy (e.g. pasting from a published Confluence page): the
 *    renderer does not write `data-client-id` on the media div. Instead, the clientId
 *    is embedded inside the blob URL on the `<img>` child element, in the hash params:
 *    `src="blob:https://...#media-blob-url=true&id=FILE_ID&...&clientId=CLIENT_ID"`
 *
 * All media nodes in a single pasted HTML fragment always share the same clientId,
 * so we extract it once and apply it to all file IDs found in the HTML.
 */

/**
 * Extract the clientId from a blob URL hash fragment (renderer-to-editor path).
 * Returns undefined if not found.
 */
const extractClientIdFromBlobUrl = (html: string): string | undefined => {
	// Matches both:
	//   - blob: URLs (client-rendered renderer)
	//   - HTTPS URLs with #media-blob-url=true in the hash (SSR-rendered renderer)
	const imgSrcRegex = /src="([^"]*#media-blob-url=true[^"]*)"/g;
	let match;
	while ((match = imgSrcRegex.exec(html)) !== null) {
		const src = match[1];
		// clientId is encoded in the hash fragment as a URL param
		// e.g. blob:https://hello.atlassian.net/uuid#media-blob-url=true&id=FILE_ID&clientId=CLIENT_ID
		const hash = src.includes('#') ? src.slice(src.indexOf('#') + 1) : '';
		// Unescape HTML-encoded ampersands that appear in raw clipboard HTML attribute values
		const decodedHash = hash.replace(/&amp;/g, '&');
		const clientId = new URLSearchParams(decodedHash).get('clientId');
		if (clientId) {
			return clientId;
		}
	}
	return undefined;
};

export const extractClientIdsFromHtml = (html: string): void => {
	if (!html) {
		return;
	}

	// All media nodes in a single paste share the same clientId.
	// Extract it once from either source:
	//   - Editor-to-editor: present as data-client-id="..." attribute
	//   - Renderer-to-editor: embedded in the blob URL hash as clientId=...
	const clientId = /data-client-id="([^"]*)"/.exec(html)?.[1] ?? extractClientIdFromBlobUrl(html);

	if (!clientId) {
		return;
	}

	// Map every file ID in the HTML to the single clientId
	const fileIdRegex = /data-id="([^"]*)"/g;
	let match;
	while ((match = fileIdRegex.exec(html)) !== null) {
		setClientIdForFile(match[1], clientId);
	}
};
