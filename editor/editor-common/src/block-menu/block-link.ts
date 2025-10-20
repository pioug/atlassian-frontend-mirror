export const DEFAULT_BLOCK_LINK_HASH_PREFIX = 'block-';

/**
 * Matches hashes that start with the block link prefix followed by a UUID
 *
 * @param hash The hash string to check (e.g., '#block-123e4567-e89b-12d3-a456-426614174000' or 'block-123e4567-e89b-12d3-a456-426614174000')
 * @param prefix The prefix to look for (default is 'block-')
 * @returns True if the hash matches the block link pattern, false otherwise
 */
export const isBlockLinkHash = (hash: string, prefix = DEFAULT_BLOCK_LINK_HASH_PREFIX) => {
	if (!hash || !prefix) {
		return false;
	}
	const regex = new RegExp(
		`^#?${prefix}[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`,
		'iu',
	);
	return regex.test(hash);
};

/**
 * Extracts the block ID from a block link hash.
 *
 * @param hash The hash string to extract the block ID from (e.g., '#block-123e4567-e89b-12d3-a456-426614174000' or 'block-123e4567-e89b-12d3-a456-426614174000')
 * @param prefix The prefix to look for (default is 'block-')
 * @returns The extracted block ID if the hash is valid, null otherwise
 */
export const extractBlockIdFromLinkHash = (
	hash: string,
	prefix = DEFAULT_BLOCK_LINK_HASH_PREFIX,
) => {
	if (!isBlockLinkHash(hash, prefix)) {
		return null;
	}
	// Remove leading # if present, then remove the prefix
	const normalized = hash.startsWith('#') ? hash.slice(1) : hash;
	return normalized.slice(prefix.length);
};
