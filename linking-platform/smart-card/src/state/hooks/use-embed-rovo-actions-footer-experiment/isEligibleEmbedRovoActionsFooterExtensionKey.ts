const EMBED_ROVO_ACTIONS_FOOTER_ELIGIBLE_EXTENSION_KEYS: ReadonlySet<string> = new Set([
	'google-object-provider',
	'onedrive-object-provider',
	'github-object-provider',
	'gitlab-object-provider',
]);

export const isEligibleEmbedRovoActionsFooterExtensionKey = (extensionKey?: string): boolean =>
	extensionKey !== undefined && EMBED_ROVO_ACTIONS_FOOTER_ELIGIBLE_EXTENSION_KEYS.has(extensionKey);
