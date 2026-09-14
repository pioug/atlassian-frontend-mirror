import type { Placement } from '@popperjs/core';

import type { TLegacyPlacement } from '@atlaskit/top-layer/legacy-placements';

/**
 * `@popperjs/core`'s `Placement` union is a strict subset of `TLegacyPlacement`
 * (the placement-map adds `top-center` / `bottom-center` on top of popper's
 * enum), so every value popper hands us is a valid legacy placement.
 *
 * The cast keeps the runtime path free of an extra module-level lookup that
 * bundlers can occasionally fail to wire up (observed as `Cannot read
 * properties of undefined (reading 'includes')` in component-test bundles).
 *
 * Shared so the React and imperative popper adapters resolve this identically.
 */
export function toLegacyPlacement(placement: Placement): TLegacyPlacement {
	return placement as TLegacyPlacement;
}
