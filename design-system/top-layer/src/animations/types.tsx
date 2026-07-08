import type { TPlacementOptions } from '../internal/resolve-placement';

/**
 * A self-contained animation preset for top-layer elements.
 *
 * Contains a data-attribute name used as a stable test and debugging hook,
 * optional per-placement custom properties, and the entry and exit durations
 * used for a `transitionend` fallback timeout.
 *
 * The actual Compiled styles are kept static and component-local so the
 * Compiled transform can extract them at build time.
 */
export type TAnimationPreset = {
	/**
	 * Data attribute suffix used as a stable test and debugging hook (e.g.
	 * `'slide-and-fade'` becomes `data-ds-popover-slide-and-fade`).
	 */
	name: string;
	/**
	 * Per-placement CSS custom properties (e.g. directional offset for
	 * `slideAndFade`). Only used by presets that vary by placement or by a
	 * configurable distance.
	 */
	getProperties?: (args: { placement: TPlacementOptions }) => Record<string, string>;
	/**
	 * Entry duration in ms (for `transitionend` fallback timeout on open).
	 */
	enterDurationMs: number;
	/**
	 * Exit duration in ms (for `transitionend` fallback timeout on close).
	 */
	exitDurationMs: number;
};
