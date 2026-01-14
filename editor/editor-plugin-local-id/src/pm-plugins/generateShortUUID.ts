import { uuid } from '@atlaskit/adf-schema';

/**
 * Global Set to track currently generated and existing short UUIDs in the document.
 * Used to prevent duplicate short IDs when using crypto.randomUUID().
 */
export const generatedShortUUIDs = new Set<string>();

/**
 * Generates a short UUID and checks for duplicates against both
 * generated UUIDs and existing UUIDs in the document.
 * Retries up to 10 times if a duplicate is found.
 * Falls back to full UUID if max retries exceeded.
 */
export const generateShortUUID = (): string => {
	const maxRetries = 10;
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			const shortUUID = crypto.randomUUID().split('-')[4];
			if (!generatedShortUUIDs.has(shortUUID)) {
				generatedShortUUIDs.add(shortUUID);
				return shortUUID;
			}
		} catch {
			break;
		}
	}
	// Fallback to full UUID if short UUID generation fails or max retries exceeded
	return uuid.generate();
};
