/**
 * Legacy Popper.js placement values (used by `@atlaskit/popper`,
 * `@atlaskit/popup`, `@atlaskit/tooltip`, etc.). Re-exported from
 * `@atlaskit/top-layer/placement-map` for migration consumers that need
 * to enumerate every placement (e.g. for a settings dropdown). New code
 * should use the object-based `TPlacementOptions` directly.
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

export type TLegacyPlacement = (typeof LEGACY_PLACEMENTS)[number];
