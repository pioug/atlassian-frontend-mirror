import type { TPlacementOptions } from '../popup/types';

/**
 * A self-contained animation preset for top-layer elements (popovers and dialogs).
 *
 * Contains the CSS rules (injected once into `<head>`), a data-attribute name
 * for CSS targeting, optional per-placement custom properties, and the exit
 * duration used for a `transitionend` fallback timeout.
 *
 * Entry animation uses `@starting-style`.
 * Exit animation uses `allow-discrete` on `display`/`overlay` to keep the
 * element visible in the top layer while CSS transitions play.
 */
export type TAnimationPreset = {
	/**
	 * CSS to inject once into `document.head`, scoped via a data attribute
	 * (e.g. `[data-ds-popover-{name}]` or `[data-ds-dialog-{name}]`).
	 */
	css: string;
	/**
	 * Data attribute suffix for CSS targeting (e.g. `'slide-and-fade'`).
	 */
	name: string;
	/**
	 * Per-placement CSS custom properties (e.g. directional offset for
	 * `slideAndFade`). Only used by popover presets that vary by placement.
	 */
	getProperties?: (args: { placement: TPlacementOptions }) => Record<string, string>;
	/**
	 * Exit duration in ms (for `transitionend` fallback timeout).
	 */
	exitDurationMs: number;
};

/**
 * @deprecated Use `TAnimationPreset` instead.
 */
export type TPopoverAnimationPreset = TAnimationPreset;

/**
 * @deprecated Use `TAnimationPreset` instead.
 */
export type TDialogAnimationPreset = TAnimationPreset;
