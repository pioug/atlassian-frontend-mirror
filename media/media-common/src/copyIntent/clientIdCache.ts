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
 */
export const extractClientIdsFromHtml = (html: string): void => {
	if (!html || !html.includes('data-client-id')) {
		return;
	}

	const mediaTagRegex = /<[^>]*data-node-type="media(?:Inline)?"[^>]*>/g;

	let match;
	while ((match = mediaTagRegex.exec(html)) !== null) {
		const tag = match[0];
		const fileId = /data-id="([^"]*)"/.exec(tag)?.[1];
		const clientId = /data-client-id="([^"]*)"/.exec(tag)?.[1];
		if (fileId && clientId) {
			setClientIdForFile(fileId, clientId);
		}
	}
};
