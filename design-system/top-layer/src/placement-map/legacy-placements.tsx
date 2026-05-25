import { type TPlacementOptions } from '../internal/resolve-placement';

/**
 * Legacy Popper.js placement values (used by `@atlaskit/popper`,
 * `@atlaskit/popup`, `@atlaskit/tooltip`, etc.). Re-exported from
 * `@atlaskit/top-layer/placement-map` for migration consumers that need
 * to enumerate every placement (e.g. for a settings dropdown). New code
 * should use the object-based `TPlacementOptions` directly.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

/**
 * The full mapping record. Internal - use `fromLegacyPlacement` from the
 * public entry-point so the offset-tuple translation is applied consistently.
 *
 * Note: `auto`, `auto-start`, `auto-end` map to `block-end` placements. This
 * is a reduction in expressiveness vs Popper.js (which picked the best
 * placement at runtime). CSS `position-try-fallbacks` flips at the edge but
 * the initial placement is fixed. Migration consumers who relied on Popper's
 * dynamic auto-flip should pick an explicit placement instead.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const placementMapping: Record<TLegacyPlacement, TPlacementOptions> = {
	top: { axis: 'block', edge: 'start', align: 'center' },
	'top-start': { axis: 'block', edge: 'start', align: 'start' },
	'top-center': { axis: 'block', edge: 'start', align: 'center' },
	'top-end': { axis: 'block', edge: 'start', align: 'end' },
	bottom: { axis: 'block', edge: 'end', align: 'center' },
	'bottom-start': { axis: 'block', edge: 'end', align: 'start' },
	'bottom-center': { axis: 'block', edge: 'end', align: 'center' },
	'bottom-end': { axis: 'block', edge: 'end', align: 'end' },
	right: { axis: 'inline', edge: 'end', align: 'center' },
	'right-start': { axis: 'inline', edge: 'end', align: 'start' },
	'right-end': { axis: 'inline', edge: 'end', align: 'end' },
	left: { axis: 'inline', edge: 'start', align: 'center' },
	'left-start': { axis: 'inline', edge: 'start', align: 'start' },
	'left-end': { axis: 'inline', edge: 'start', align: 'end' },
	auto: { axis: 'block', edge: 'end', align: 'center' },
	'auto-start': { axis: 'block', edge: 'end', align: 'start' },
	'auto-end': { axis: 'block', edge: 'end', align: 'end' },
};
