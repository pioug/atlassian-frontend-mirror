/**
 * Stable identifiers for registry-backed block-control surfaces and their layout containers.
 * They live in editor-common so contributors do not depend on the Block Controls plugin.
 */
export const BLOCK_CONTROLS_LEFT_SURFACE = {
	key: 'block-controls-left',
	type: 'toolbar',
} as const;

export const BLOCK_CONTROLS_RIGHT_SURFACE = {
	key: 'block-controls-right',
	type: 'toolbar',
} as const;

export const BLOCK_CONTROLS_LEFT_SECTION = {
	key: 'block-controls-left-section',
	type: 'section',
} as const;

export const BLOCK_CONTROLS_LEFT_GROUP = {
	key: 'block-controls-left-group',
	type: 'group',
} as const;

export const BLOCK_CONTROLS_RIGHT_SECTION = {
	key: 'block-controls-right-section',
	type: 'section',
} as const;

export const BLOCK_CONTROLS_RIGHT_GROUP = {
	key: 'block-controls-right-group',
	type: 'group',
} as const;
