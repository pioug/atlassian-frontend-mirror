// Alignment constants
export const ALIGNMENT_VALUES = ['left', 'center', 'right', 'wrap-left', 'wrap-right'] as const;

export const DEFAULT_ALIGNMENT = 'center' as const;

// Built-in toolbar action keys that can be referenced in the order array.
export const BUILTIN_TOOLBAR_KEYS = {
	REFRESH: 'refresh',
	EMBED: 'embed',
	BORDER: 'border',
	ALIGNMENT: 'alignment',
	OPEN_IN_NEW_WINDOW: 'openInNewWindow',
	MORE_OPTIONS: 'moreOptions',
	SEPARATOR: 'separator',
} as const;
