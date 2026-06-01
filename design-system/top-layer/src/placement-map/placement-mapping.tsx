import { type TPlacementOptions } from '../internal/resolve-placement';

import type { TLegacyPlacement } from './legacy-placements';

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
