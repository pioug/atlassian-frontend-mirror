import { type TPlacementOptions } from '../internal/resolve-placement';
import type { TLegacyPlacement } from './legacy-placements';
import { placementMapping } from './placement-mapping';

/**
 * Maps a legacy Popper.js placement value to the object-based
 * `TPlacementOptions` used by `@atlaskit/top-layer/popover`.
 *
 * **Mapping**
 *
 * | Legacy (Popper.js) | `TPlacementOptions`                                  |
 * | ------------------ | ---------------------------------------------------- |
 * | `top`              | `{ axis: 'block', edge: 'start', align: 'center' }`  |
 * | `top-start`        | `{ axis: 'block', edge: 'start', align: 'start' }`   |
 * | `top-center`       | `{ axis: 'block', edge: 'start', align: 'center' }`  |
 * | `top-end`          | `{ axis: 'block', edge: 'start', align: 'end' }`     |
 * | `bottom`           | `{ axis: 'block', edge: 'end', align: 'center' }`    |
 * | `bottom-start`     | `{ axis: 'block', edge: 'end', align: 'start' }`     |
 * | `bottom-center`    | `{ axis: 'block', edge: 'end', align: 'center' }`    |
 * | `bottom-end`       | `{ axis: 'block', edge: 'end', align: 'end' }`       |
 * | `right`            | `{ axis: 'inline', edge: 'end', align: 'center' }`   |
 * | `right-start`      | `{ axis: 'inline', edge: 'end', align: 'start' }`    |
 * | `right-end`        | `{ axis: 'inline', edge: 'end', align: 'end' }`      |
 * | `left`             | `{ axis: 'inline', edge: 'start', align: 'center' }` |
 * | `left-start`       | `{ axis: 'inline', edge: 'start', align: 'start' }`  |
 * | `left-end`         | `{ axis: 'inline', edge: 'start', align: 'end' }`    |
 * | `auto`             | `{ axis: 'block', edge: 'end', align: 'center' }`    |
 * | `auto-start`       | `{ axis: 'block', edge: 'end', align: 'start' }`     |
 * | `auto-end`         | `{ axis: 'block', edge: 'end', align: 'end' }`       |
 *
 * `auto`, `auto-start` and `auto-end` mean below the trigger, unless the
 * popover does not fit. Then `position-try-fallbacks` move it sideways or flip
 * it above. There is no "most space" choice as in Popper. A caller that needs
 * a side sets a real placement. See `notes/decisions/auto-placement.md`.
 *
 * @example
 * ```ts
 * import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map/index';
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
	/**
	 * Popper's `offset` tuple, in pixels. `along` becomes `offset.crossAxisShift`
	 * and `away` becomes `offset.gap`.
	 */
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
				// `direction` holds the sign and `value` holds the magnitude.
				value: Math.abs(along),
				direction: along >= 0 ? 'forwards' : 'backwards',
			},
		},
	};
}

export type { TLegacyPlacement, TPlacementOptions };
