import { NATIVE_EMBED_EXTENSION_KEY } from './manifest-helpers';

const NATIVE_EMBED_EXPERIENCE_PREFIX = `${NATIVE_EMBED_EXTENSION_KEY}:`;

/**
 * Returns the experience id from a native-embed `extensionKey`, e.g.
 * `native-embed:database` → `database`. Handles keys where other segments
 * appear before the prefix (e.g. `…:native-embed:database`).
 */
export const getNativeEmbedExperienceIdFromExtensionKey = (
	extensionKey: string | undefined,
): string | undefined => {
	if (!extensionKey) {
		return undefined;
	}
	const idx = extensionKey.indexOf(NATIVE_EMBED_EXPERIENCE_PREFIX);
	if (idx === -1) {
		return undefined;
	}
	const id = extensionKey.slice(idx + NATIVE_EMBED_EXPERIENCE_PREFIX.length);
	return id || undefined;
};
