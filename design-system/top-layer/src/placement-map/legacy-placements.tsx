/**
 * Every legacy Popper.js placement value (used by `@atlaskit/popper`,
 * `@atlaskit/popup`, `@atlaskit/tooltip` and others). For migration consumers
 * that need to list every placement, for example in a settings dropdown. Also
 * re-exported from `@atlaskit/top-layer/placement-map`. New code should use the
 * object-based `TPlacementOptions` directly.
 */
export const LEGACY_PLACEMENTS = [
	'auto',
	'auto-start',
	'auto-end',
	'top',
	'top-start',
	'top-center',
	'top-end',
	'bottom',
	'bottom-start',
	'bottom-center',
	'bottom-end',
	'right',
	'right-start',
	'right-end',
	'left',
	'left-start',
	'left-end',
] as const;

/**
 * One legacy Popper.js placement value. Convert it with `fromLegacyPlacement`.
 */
export type TLegacyPlacement = (typeof LEGACY_PLACEMENTS)[number];
