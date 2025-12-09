// TODO: AFO-3523
// Those are the attributes we have found when testing the 'fy25.03' manually.
// We still need to replace this hardcoded list with a proper automation
export const KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS: string[] = [
	'data-drop-target-for-element',
	'data-drop-target-for-external',
	'draggable',
	'data-is-observed',
	'data-aui-version',
	'data-testid',
	'data-vc',
	'data-ssr-placeholder',
	'data-ssr-placeholder-replace',
	'data-vc-nvs',
	'data-media-vc-wrapper',
	'data-renderer-start-pos',
	'data-table-local-id',
	'spellcheck',
	'data-auto-scrollable',
	'id',
	'tabindex',
	'data-is-ttvc-ready',
	'contenteditable',
	'data-has-collab-initialised',
	'translate',
];

// Common aria attributes that don't cause visual layout shifts
export const NON_VISUAL_ARIA_ATTRIBUTES: string[] = [
	'aria-label',
	'aria-labelledby',
	'aria-describedby',
	'aria-hidden',
	'aria-expanded',
	'aria-controls',
	'aria-selected',
	'aria-checked',
	'aria-disabled',
	'aria-required',
	'aria-current',
	'aria-haspopup',
	'aria-pressed',
	'aria-atomic',
	'aria-live',
];

// Common third party browser extension attributes
export const THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES: string[] = [
	'bis_skin_checked',
	'cz-shortcut-listen',
	'monica-version',
	'data-gr-ext-installed',
	'data-dashlane-rid',
	'sapling-installed',
	'data-gptw',
	// grammarly extensions
	'data-new-gr-c-s-loaded',
	'data-gr-aaa-notch-connection-id',
	'data-gr-aaa-loaded',
];
