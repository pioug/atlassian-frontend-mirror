type AppProvenance = { source?: string } | undefined;

const QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX = 'quick-insert-provider-';
const ECOSYSTEM_QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX = 'quick-insert-ecosystem';

export const getQuickInsertProviderMenuItemKey = (key: string, app?: AppProvenance): string =>
	app?.source === 'ecosystem'
		? `${ECOSYSTEM_QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX}-${key}`
		: `${QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX}${key}`;

const isEcosystemQuickInsertProviderMenuItemKey = (key: string): boolean =>
	key.startsWith(ECOSYSTEM_QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX);

const normalizeQuickInsertProviderMenuItemKey = (key: string): string =>
	isEcosystemQuickInsertProviderMenuItemKey(key)
		? `${QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX}${key.slice(
				`${ECOSYSTEM_QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX}-`.length,
			)}`
		: key;

/** Reverses `getQuickInsertProviderMenuItemKey`; keys without a provider prefix are returned unchanged. */
const getQuickInsertProviderMenuItemSourceKey = (key: string): string => {
	const normalizedKey = normalizeQuickInsertProviderMenuItemKey(key);
	return normalizedKey.startsWith(QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX)
		? normalizedKey.slice(QUICK_INSERT_PROVIDER_MENU_ITEM_KEY_PREFIX.length)
		: key;
};

export const quickInsertProviderMenuItemKey: {
	get: (key: string, app?: AppProvenance) => string;
	getSourceKey: (key: string) => string;
	isEcosystem: (key: string) => boolean;
	normalize: (key: string) => string;
} = {
	get: getQuickInsertProviderMenuItemKey,
	getSourceKey: getQuickInsertProviderMenuItemSourceKey,
	isEcosystem: isEcosystemQuickInsertProviderMenuItemKey,
	normalize: normalizeQuickInsertProviderMenuItemKey,
};
