import { type TPlacement } from '../internal/resolve-placement';
import { type TPlacementOptions } from '../popup/types';

/**
 * Legacy Popper.js placement values (used by `@atlaskit/popper`, `@atlaskit/popup`,
 * `@atlaskit/tooltip`, etc.).
 */
export type TLegacyPlacement =
	| 'auto'
	| 'auto-start'
	| 'auto-end'
	| 'top'
	| 'top-start'
	| 'top-center'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-center'
	| 'bottom-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'left'
	| 'left-start'
	| 'left-end';

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
 * | `top-end`           | `{ axis: 'block', edge: 'start', align: 'end' }`     |
 * | `bottom`            | `{ axis: 'block', edge: 'end', align: 'center' }`    |
 * | `bottom-start`      | `{ axis: 'block', edge: 'end', align: 'start' }`     |
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
 * The `position-try-fallbacks` CSS property handles flipping automatically.
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
const placementMapping: Record<TLegacyPlacement, TPlacement> = {
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

/**
 * Convert a legacy Popper.js placement to the new CSS `position-area`-based Placement.
 */
export function fromLegacyPlacement({ legacy }: { legacy: TLegacyPlacement }): TPlacementOptions {
	return placementMapping[legacy];
}

/**
 * The full mapping record, exposed for consumers that need to iterate or introspect.
 */
export { placementMapping };

export type { TPlacementOptions };
