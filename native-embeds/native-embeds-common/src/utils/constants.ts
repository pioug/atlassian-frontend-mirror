// Alignment constants
export const ALIGNMENT_VALUES = ['left', 'center', 'right', 'wrap-left', 'wrap-right'] as const;

export const DEFAULT_ALIGNMENT = 'center' as const;

/**
 * Built-in keys that can be referenced in the `items` and `moreItems` arrays.
 *
 * Toolbar keys: REFRESH, EMBED, BORDER, ALIGNMENT, OPEN_IN_NEW_WINDOW
 * More Options dropdown keys: ALWAYS_SHOW_TITLE, SET_EMBED_TYPE, COPY_LINK, DELETE
 * Shared: SEPARATOR (usable in both)
 */
export const BUILTIN_TOOLBAR_KEYS = {
	REFRESH: 'refresh',
	EMBED: 'embed',
	BORDER: 'border',
	ALIGNMENT: 'alignment',
	OPEN_IN_NEW_WINDOW: 'openInNewWindow',
	ALWAYS_SHOW_TITLE: 'alwaysShowTitle',
	SET_EMBED_TYPE: 'setEmbedType',
	COPY_LINK: 'copyLink',
	DELETE: 'delete',
	SEPARATOR: 'separator',
} as const;
