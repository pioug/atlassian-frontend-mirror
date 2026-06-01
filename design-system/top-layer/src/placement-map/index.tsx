import { type TPlacementOptions } from '../internal/resolve-placement';

import type { TLegacyPlacement } from './legacy-placements';
import { placementMapping } from './placement-mapping';

/**
 * Maps legacy Popper.js placement values to the new object-based
 * `Placement` values used by `@atlaskit/top-layer/popover`.
 *
 * **Mapping logic:**
 *
 * | Legacy (Popper.js)  | New (Placement object)                              |
 * | ------------------- | --------------------------------------------------- |
 * | `top`               | `{ axis: 'block', edge: 'start', align: 'center' }`  |
 * | `top-start`         | `{ axis: 'block', edge: 'start', align: 'start' }`   |
 * | `top-center`        | `{ axis: 'block', edge: 'start', align: 'center' }`  |
 * | `top-end`           | `{ axis: 'block', edge: 'start', align: 'end' }`     |
 * | `bottom`            | `{ axis: 'block', edge: 'end', align: 'center' }`    |
 * | `bottom-start`      | `{ axis: 'block', edge: 'end', align: 'start' }`     |
 * | `bottom-center`     | `{ axis: 'block', edge: 'end', align: 'center' }`    |
 * | `bottom-end`        | `{ axis: 'block', edge: 'end', align: 'end' }`       |
 * | `right`             | `{ axis: 'inline', edge: 'end', align: 'center' }`   |
 * | `right-start`       | `{ axis: 'inline', edge: 'end', align: 'start' }`    |
 * | `right-end`         | `{ axis: 'inline', edge: 'end', align: 'end' }`      |
 * | `left`              | `{ axis: 'inline', edge: 'start', align: 'center' }` |
 * | `left-start`        | `{ axis: 'inline', edge: 'start', align: 'start' }`  |
 * | `left-end`          | `{ axis: 'inline', edge: 'start', align: 'end' }`    |
 * | `auto`              | `{ axis: 'block', edge: 'end', align: 'center' }`    |
 * | `auto-start`        | `{ axis: 'block', edge: 'end', align: 'start' }`     |
 * | `auto-end`          | `{ axis: 'block', edge: 'end', align: 'end' }`       |
 *
 * `auto*` is mapped to `block-end` (a reduction in expressiveness vs Popper's
 * runtime auto-flip). CSS `position-try-fallbacks` provides flipping at the
 * edge - but the initial placement is fixed. If migrating away from Popper's
 * dynamic auto, prefer an explicit placement.
 *
 * @example
 * ```ts
 * import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map';
 *
 * // In a migration from @atlaskit/popup:
 * const oldPlacement: TLegacyPlacement = 'bottom-start';
 * const newPlacement: TPlacementOptions = fromLegacyPlacement({ legacy: oldPlacement });
 * // newPlacement === { axis: 'block', edge: 'end', align: 'start' }
 * ```
 */
export function fromLegacyPlacement({
	legacy,
	offset,
}: {
	legacy: TLegacyPlacement;
	offset?: [along: number, away: number];
}): TPlacementOptions {
	const basePlacement = placementMapping[legacy];

	if (!offset) {
		return basePlacement;
	}

	const [along, away] = offset;

	return {
		...basePlacement,
		offset: {
			gap: away,
			crossAxisShift: {
				// Sign is captured in `direction`; `value` is the magnitude.
				value: Math.abs(along),
				direction: along >= 0 ? 'forwards' : 'backwards',
			},
		},
	};
}

export type { TLegacyPlacement, TPlacementOptions };
