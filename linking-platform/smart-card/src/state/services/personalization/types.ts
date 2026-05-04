export type PersonalizationTrait = {
	name: string;
	value: string | boolean | number;
};

/**
 * Map of extensionKey to connected users percentage.
 * Keys are extensionKeys directly (e.g. 'google-object-provider').
 * Values are integers 0-100.
 */
export type ProviderPctMap = Record<string, number>;
