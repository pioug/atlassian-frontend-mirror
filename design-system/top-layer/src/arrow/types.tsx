import type { TPlacementOptions } from '../popup/types';

/**
 * A self-contained arrow preset for PopoverContent.
 *
 * Contains the CSS rules (injected once into `<head>`), a data-attribute name
 * for CSS targeting, and a function to compute `position-try-fallbacks` values
 * that change both `position-area` and `margin` when the popover flips.
 *
 * Imported from `@atlaskit/top-layer/arrow` so that consumers who don't use
 * arrows pay no bundle cost for the CSS string or fallback logic.
 */
export type TArrowPreset = {
	/**
	 * CSS to inject once into `document.head`, scoped to `[data-ds-popover-{name}]`.
	 */
	css: string;
	/**
	 * Data attribute suffix for CSS targeting (e.g. `'arrow'`).
	 */
	name: string;
	/**
	 * Returns the `position-try-fallbacks` value for a given placement.
	 * Uses named `@position-try` rules that update both `position-area`
	 * and `margin` so the correct arrow is revealed after a flip.
	 */
	getTryFallbacks: (args: { placement: TPlacementOptions }) => string;
};
