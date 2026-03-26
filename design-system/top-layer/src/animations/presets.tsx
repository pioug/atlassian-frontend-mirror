import { getPlacement } from '../internal/use-anchor-positioning';
import { type TPlacementOptions } from '../popup/types';

import { type TAnimationPreset } from './types';

// ── slideAndFade ──

type TSlideAndFadeOptions = {
	/**
	 * Slide distance in pixels. Defaults to `4`.
	 */
	distance?: number;
};

function getSlideAndFadeProperties({
	placement,
	distance,
}: {
	placement: TPlacementOptions;
	distance: number;
}): Record<string, string> {
	const pos = `${distance}px`;
	const neg = `-${distance}px`;
	const { axis, edge } = getPlacement({ placement });

	if (axis === 'block' && edge === 'start') {
		return { '--ds-popover-tx': '0', '--ds-popover-ty': pos };
	}
	if (axis === 'block' && edge === 'end') {
		return { '--ds-popover-tx': '0', '--ds-popover-ty': neg };
	}
	if (axis === 'inline' && edge === 'start') {
		return { '--ds-popover-tx': pos, '--ds-popover-ty': '0' };
	}
	if (axis === 'inline' && edge === 'end') {
		return { '--ds-popover-tx': neg, '--ds-popover-ty': '0' };
	}

	return { '--ds-popover-tx': '0', '--ds-popover-ty': neg };
}

const SLIDE_AND_FADE_CSS = `
[data-ds-popover-slide-and-fade] {
  opacity: 0;
  transform: translate3d(var(--ds-popover-tx, 0), var(--ds-popover-ty, 0), 0);
  transition:
    opacity 175ms cubic-bezier(0.15, 1, 0.3, 1),
    transform 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-popover-slide-and-fade]:popover-open {
  opacity: 1;
  transform: none;
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-popover-slide-and-fade]:popover-open {
    opacity: 0;
    transform: translate3d(var(--ds-popover-tx, 0), var(--ds-popover-ty, 0), 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-ds-popover-slide-and-fade],
  [data-ds-popover-slide-and-fade]:popover-open {
    transition-duration: 0s;
  }
}
`;

/**
 * Directional slide + opacity animation.
 *
 * The popover slides in from the direction opposite its placement edge
 * (e.g. a `block-end` popover slides down from above).
 *
 * @param options.distance - Slide distance in pixels. Defaults to `4`.
 *
 * @example
 * ```tsx
 * import { slideAndFade } from '@atlaskit/top-layer/animations';
 *
 * // Default 4px slide (tooltip)
 * <Popup.Content animate={slideAndFade()} />
 *
 * // Custom 8px slide (popup / dropdown)
 * <Popup.Content animate={slideAndFade({ distance: 8 })} />
 * ```
 */
export function slideAndFade(options?: TSlideAndFadeOptions): TAnimationPreset {
	const distance = options?.distance ?? 4;

	return {
		name: 'slide-and-fade',
		css: SLIDE_AND_FADE_CSS,
		getProperties: ({ placement }: { placement: TPlacementOptions }) =>
			getSlideAndFadeProperties({ placement, distance }),
		exitDurationMs: 175,
	};
}

// ── fade ──

const FADE_CSS = `
[data-ds-popover-fade] {
  opacity: 0;
  transition:
    opacity 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-popover-fade]:popover-open {
  opacity: 1;
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-popover-fade]:popover-open {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-ds-popover-fade],
  [data-ds-popover-fade]:popover-open {
    transition-duration: 0s;
  }
}
`;

/**
 * Simple opacity transition, no transform.
 *
 * Suitable for popup dialogs or content that does not need directional motion.
 *
 * @example
 * ```tsx
 * import { fade } from '@atlaskit/top-layer/animations';
 *
 * <Popup.Content animate={fade()} />
 * ```
 */
export function fade(): TAnimationPreset {
	return {
		name: 'fade',
		css: FADE_CSS,
		exitDurationMs: 175,
	};
}

// ── scaleAndFade ──

const SCALE_AND_FADE_CSS = `
[data-ds-popover-scale-and-fade] {
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 175ms cubic-bezier(0.15, 1, 0.3, 1),
    transform 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-popover-scale-and-fade]:popover-open {
  opacity: 1;
  transform: none;
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-popover-scale-and-fade]:popover-open {
    opacity: 0;
    transform: scale(0.95);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-ds-popover-scale-and-fade],
  [data-ds-popover-scale-and-fade]:popover-open {
    transition-duration: 0s;
  }
}
`;

/**
 * Scale from 0.95 + opacity transition.
 *
 * Suitable for menus, dropdowns, and select options.
 *
 * @example
 * ```tsx
 * import { scaleAndFade } from '@atlaskit/top-layer/animations';
 *
 * <Popup.Content animate={scaleAndFade()} />
 * ```
 */
export function scaleAndFade(): TAnimationPreset {
	return {
		name: 'scale-and-fade',
		css: SCALE_AND_FADE_CSS,
		exitDurationMs: 175,
	};
}

// ══════════════════════════════════════════════════════════════════════════════
// Dialog presets
// ══════════════════════════════════════════════════════════════════════════════

// ── dialogSlideUpAndFade ──

type TDialogSlideUpAndFadeOptions = {
	/**
	 * Slide distance in pixels. Defaults to `12`.
	 */
	distance?: number;
};

const DIALOG_SLIDE_UP_AND_FADE_CSS = `
[data-ds-dialog-slide-up-and-fade] {
  opacity: 0;
  transform: translateY(calc(-1 * var(--ds-dialog-ty, 12px)));
  transition:
    opacity 175ms cubic-bezier(0.15, 1, 0.3, 1),
    transform 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-dialog-slide-up-and-fade][open] {
  opacity: 1;
  transform: none;
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-dialog-slide-up-and-fade][open] {
    opacity: 0;
    transform: translateY(var(--ds-dialog-ty, 12px));
  }
}

[data-ds-dialog-slide-up-and-fade]::backdrop {
  background-color: transparent;
  transition:
    background-color 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-dialog-slide-up-and-fade][open]::backdrop {
  background-color: var(--ds-blanket, #050C1F75);
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-dialog-slide-up-and-fade][open]::backdrop {
    background-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-ds-dialog-slide-up-and-fade],
  [data-ds-dialog-slide-up-and-fade][open],
  [data-ds-dialog-slide-up-and-fade]::backdrop,
  [data-ds-dialog-slide-up-and-fade][open]::backdrop {
    transition-duration: 0s;
  }
}
`;

/**
 * Slide up + opacity animation for dialogs.
 *
 * Entry slides up from below; exit slides up and out (asymmetric).
 * Includes backdrop fade animation.
 *
 * @param options.distance - Slide distance in pixels. Defaults to `12`.
 *
 * @example
 * ```tsx
 * import { dialogSlideUpAndFade } from '@atlaskit/top-layer/animations';
 *
 * const animation = dialogSlideUpAndFade();
 * <Dialog animate={animation} isOpen={isOpen} onClose={handleClose} label="...">
 *   ...
 * </Dialog>
 * ```
 */
export function dialogSlideUpAndFade(options?: TDialogSlideUpAndFadeOptions): TAnimationPreset {
	const distance = options?.distance ?? 12;

	return {
		name: distance === 12 ? 'dialog-slide-up-and-fade' : `dialog-slide-up-and-fade-${distance}`,
		css:
			distance === 12
				? DIALOG_SLIDE_UP_AND_FADE_CSS
				: DIALOG_SLIDE_UP_AND_FADE_CSS.replace(/12px/g, `${distance}px`),
		exitDurationMs: 175,
	};
}

// ── dialogFade ──

const DIALOG_FADE_CSS = `
[data-ds-dialog-fade] {
  opacity: 0;
  transition:
    opacity 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-dialog-fade][open] {
  opacity: 1;
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-dialog-fade][open] {
    opacity: 0;
  }
}

[data-ds-dialog-fade]::backdrop {
  background-color: transparent;
  transition:
    background-color 175ms cubic-bezier(0.15, 1, 0.3, 1),
    overlay 175ms allow-discrete,
    display 175ms allow-discrete;
}

[data-ds-dialog-fade][open]::backdrop {
  background-color: var(--ds-blanket, #050C1F75);
  transition-duration: 350ms;
}

@starting-style {
  [data-ds-dialog-fade][open]::backdrop {
    background-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-ds-dialog-fade],
  [data-ds-dialog-fade][open],
  [data-ds-dialog-fade]::backdrop,
  [data-ds-dialog-fade][open]::backdrop {
    transition-duration: 0s;
  }
}
`;

/**
 * Simple opacity transition for dialogs, no transform.
 *
 * Includes backdrop fade animation.
 *
 * @example
 * ```tsx
 * import { dialogFade } from '@atlaskit/top-layer/animations';
 *
 * <Dialog animate={dialogFade()} isOpen={isOpen} onClose={handleClose} label="...">
 *   ...
 * </Dialog>
 * ```
 */
export function dialogFade(): TAnimationPreset {
	return {
		name: 'dialog-fade',
		css: DIALOG_FADE_CSS,
		exitDurationMs: 175,
	};
}
