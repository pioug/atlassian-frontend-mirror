import type { NativeEmbedParameterValues } from './types';

// ─── Embed depth constants ──────────────────────────────────────────────────

/**
 * URL query-parameter key used to track the current embedding depth.
 * Each nested native-embed iframe increments this value by 1.
 */
export const EMBED_DEPTH_QUERY_PARAM = 'nativeEmbedDepth' as const;

/**
 * Maximum allowed embedding depth.  When `getCurrentEmbedDepth()` returns a
 * value **≥** this limit the extension renderer should display a fallback
 * instead of another iframe to prevent infinite recursion.
 */
export const MAX_EMBED_DEPTH = 2;

/**
 * Read the current embedding depth from `window.location.search`.
 *
 * Returns `0` when the parameter is absent or cannot be parsed as a
 * non-negative integer, which is the expected case for top-level pages.
 */
export const getCurrentEmbedDepth = (): number => {
	if (typeof window === 'undefined') {
		return 0;
	}
	const raw = new URLSearchParams(window.location.search).get(EMBED_DEPTH_QUERY_PARAM);
	if (raw === null) {
		return 0;
	}
	const parsed = Number(raw);
	return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
};

// Alignment constants
export const ALIGNMENT_VALUES = ['left', 'center', 'right', 'wrap-left', 'wrap-right'] as const;

export const DEFAULT_ALIGNMENT = 'center' as const;

export const NATIVE_EMBED_PARAMETER_DEFAULTS: NativeEmbedParameterValues = {
	url: undefined,
	alwaysShowTitle: false,
	alignment: DEFAULT_ALIGNMENT,
	displayText: undefined,
	height: 600,
	width: undefined,
};

/**
 * Built-in keys that can be referenced in the `items` and `moreItems` arrays.
 *
 * Toolbar keys: ASK_ROVO, SUMMARISE, REFRESH, EDIT, EMBED, BORDER, ALIGNMENT, OPEN_IN_NEW_WINDOW
 * More Options dropdown keys: ALWAYS_SHOW_TITLE, SET_EMBED_TYPE, COPY, COPY_LINK (deprecated), DELETE
 * Shared: SEPARATOR (usable in both)
 */
export const BUILTIN_TOOLBAR_KEYS = {
	ASK_ROVO: 'askRovo',
	SUMMARISE: 'summarise',
	REFRESH: 'refresh',
	EDIT: 'edit',
	EMBED: 'embed',
	BORDER: 'border',
	ALIGNMENT: 'alignment',
	OPEN_IN_NEW_WINDOW: 'openInNewWindow',
	/** Opens the embed's fullscreen preview dialog. */
	EXPAND: 'expand',
	EDIT_URL: 'editUrl',
	ALWAYS_SHOW_TITLE: 'alwaysShowTitle',
	SET_EMBED_TYPE: 'setEmbedType',
	/**
	 * Copies the native-embed node to the clipboard.
	 */
	COPY: 'copy',
	/**
	 * @private
	 * @deprecated Use `COPY` instead. `COPY_LINK` is a deprecated alias for `COPY` and will be removed in a future release.
	 */
	COPY_LINK: 'copyLink',
	DELETE: 'delete',
	SEPARATOR: 'separator',
} as const;

export const EDITOR_TOOLBAR_HANDLER_KEYS = [
	'onAlignmentClick',
	'onAppearanceClick',
	'onAskRovoClick',
	'onSummariseClick',
	'onChangeBorderClick',
	'onCopyClick',
	'onCopyLinkClick',
	'onDeleteClick',
	'onEditClick',
	'onEditUrlClick',
	'onExpandClick',
	'onOpenInNewWindowClick',
	'onRefreshClick',
	'onSetEmbedTypeClick',
	'onShowTitleClick',
] as const;
