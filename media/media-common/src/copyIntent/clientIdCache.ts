/**
 * Cache for storing fileId to clientId mapping during paste operations.
 * This avoids the need to store clientId in ADF schema attributes.
 *
 * Used for cross-client copy/paste scenarios
 *
 * Entries are one-time use (consumed on read), with a max size limit
 * to guard against build-up if entries are never consumed (should not happpen).
 */

const CLIENT_ID_CACHE_MAX_SIZE = 100;

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
 * Retrieve and consume clientId for a file ID (called during copyFile)
 * Returns undefined if not found.
 */
export const getClientIdForFile = (fileId: string): string | undefined => {
	const clientId = clientIdCache.get(fileId);
	// Consume the entry after reading (one-time use)
	if (clientId) {
		clientIdCache.delete(fileId);
	}
	return clientId;
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
