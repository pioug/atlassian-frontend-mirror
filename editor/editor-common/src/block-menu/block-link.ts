export const DEFAULT_BLOCK_LINK_HASH_PREFIX = 'block-';

/**
 * Matches hashes that start with the block link prefix followed by either:
 * - A UUID (e.g., '123e4567-e89b-12d3-a456-426614174000')
 * - A short hex ID (e.g., 'ab2366c43b52')
 *
 * Short hex IDs are 12-character hexadecimal strings without dashes, used in some contexts
 * as a compact alternative to full UUIDs. Both formats are valid block identifiers.
 *
 * Note: The short ID pattern matches exactly 12 hex characters. While this could theoretically
 * match heading IDs or other anchors, block links are typically generated programmatically
 * with known ID formats, minimizing collision risk.
 *
 * @param hash - The hash string to check (e.g., '#block-123e4567-e89b-12d3-a456-426614174000', '#block-ab2366c43b52', or without '#').
 * @param prefix - The prefix to look for (default is 'block-').
 * @returns True if the hash matches the block link pattern, false otherwise.
 */
export const isBlockLinkHash = (
	hash: string,
	prefix: string = DEFAULT_BLOCK_LINK_HASH_PREFIX,
): boolean => {
	if (!hash || !prefix) {
		return false;
	}
	// Match either UUID format (8-4-4-4-12) or short hex ID format (exactly 12 hex chars without dashes).
	const uuidRegex = new RegExp(
		`^#?${prefix}[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`,
		'iu',
	);
	const shortIdRegex = new RegExp(`^#?${prefix}[0-9a-f]{12}$`, 'iu');
	return uuidRegex.test(hash) || shortIdRegex.test(hash);
};

/**
 * Extracts the block ID from a block link hash.
 *
 * Supports both UUID format (e.g., '123e4567-e89b-12d3-a456-426614174000') and
 * short hex ID format (e.g., 'ab2366c43b52').
 *
 * @param hash - The hash string to extract the block ID from (e.g., '#block-123e4567-e89b-12d3-a456-426614174000', '#block-ab2366c43b52', or without '#').
 * @param prefix - The prefix to look for (default is 'block-').
 * @returns The extracted block ID if the hash is valid, null otherwise.
 */
export const extractBlockIdFromLinkHash = (
	hash: string,
	prefix: string = DEFAULT_BLOCK_LINK_HASH_PREFIX,
) => {
	if (!isBlockLinkHash(hash, prefix)) {
		return null;
	}
	// Remove leading # if present, then remove the prefix.
	const normalized = hash.startsWith('#') ? hash.slice(1) : hash;
	return normalized.slice(prefix.length);
};

/**
 * Creates a block link hash from a given block ID.
 *
 * @param blockId - The block ID to create the hash from (e.g., '123e4567-e89b-12d3-a456-426614174000').
 * @param prefix - The prefix to use (default is 'block-').
 * @returns The constructed block link hash value (e.g., 'block-123e4567-e89b-12d3-a456-426614174000').
 */
export const createBlockLinkHashValue = (
	blockId: string,
	prefix: string = DEFAULT_BLOCK_LINK_HASH_PREFIX,
) => {
	return `${prefix}${blockId}`;
};
