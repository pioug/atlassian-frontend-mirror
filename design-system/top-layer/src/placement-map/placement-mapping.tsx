import { type TPlacementOptions } from '../internal/resolve-placement';
import type { TLegacyPlacement } from './legacy-placements';

/**
 * Each legacy Popper.js placement and its `TPlacementOptions`. Internal: use
 * `fromLegacyPlacement` from the public entry point, which also translates the
 * offset tuple. See `fromLegacyPlacement` for why `auto*` maps to `block-end`.
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
