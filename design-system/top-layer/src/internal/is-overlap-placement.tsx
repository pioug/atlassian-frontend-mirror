import { type TOverlapPlacement, type TResolvedPlacement } from './resolve-placement';

/**
 * Narrows a resolved placement to the edges that overlap the anchor.
 */
export function isOverlapPlacement(placement: TResolvedPlacement): placement is TOverlapPlacement {
	return (
		placement.edge === 'overlap-start' ||
		placement.edge === 'overlap-center' ||
		placement.edge === 'overlap-end'
	);
}
