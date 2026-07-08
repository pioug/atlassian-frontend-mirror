import { token } from '@atlaskit/tokens';

import { getPlacement, type TPlacementOptions } from '../internal/resolve-placement';

import { type TAnimationPreset } from './types';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const animationDurations = {
	popupMotion: {
		enter: 150,
		exit: 100,
	},
	popoverTransition: {
		enter: 350,
		exit: 175,
	},
	dialogMotion: {
		enter: 250,
		exit: 200,
	},
	dialogTransition: {
		enter: 350,
		exit: 175,
	},
} as const;
// popupMotion

function getPopupMotionProperties({
	placement,
}: {
	placement: TPlacementOptions;
}): Record<string, string> {
	const { axis, edge } = getPlacement({ placement });

	if (axis === 'block' && edge === 'start') {
		return {
			'--ds-popover-motion-enter': token('motion.popup.enter.top'),
			'--ds-popover-motion-exit': token('motion.popup.exit.top'),
		};
	}
	if (axis === 'inline' && edge === 'start') {
		return {
			'--ds-popover-motion-enter': token('motion.popup.enter.left'),
			'--ds-popover-motion-exit': token('motion.popup.exit.left'),
		};
	}
	if (axis === 'inline' && edge === 'end') {
		return {
			'--ds-popover-motion-enter': token('motion.popup.enter.right'),
			'--ds-popover-motion-exit': token('motion.popup.exit.right'),
		};
	}
	// Default: block/end (popover below trigger)
	return {
		'--ds-popover-motion-enter': token('motion.popup.enter.bottom'),
		'--ds-popover-motion-exit': token('motion.popup.exit.bottom'),
	};
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function popupMotion(): TAnimationPreset {
	return {
		name: 'popup-motion',
		enterDurationMs: animationDurations.popupMotion.enter,
		exitDurationMs: animationDurations.popupMotion.exit,
		getProperties: ({ placement }) => getPopupMotionProperties({ placement }),
	};
}

// slideAndFade

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
 * <Popover animate={slideAndFade()} />
 *
 * // Custom 8px slide (popup / dropdown)
 * <Popover animate={slideAndFade({ distance: 8 })} />
 * ```
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function slideAndFade(options?: TSlideAndFadeOptions): TAnimationPreset {
	const distance = options?.distance ?? 4;

	return {
		name: 'slide-and-fade',
		getProperties: ({ placement }: { placement: TPlacementOptions }) =>
			getSlideAndFadeProperties({ placement, distance }),
		enterDurationMs: animationDurations.popoverTransition.enter,
		exitDurationMs: animationDurations.popoverTransition.exit,
	};
}

// fade

/**
 * Simple opacity transition, no transform.
 *
 * Suitable for popup dialogs or content that does not need directional motion.
 *
 * @example
 * ```tsx
 * import { fade } from '@atlaskit/top-layer/animations';
 *
 * <Popover animate={fade()} />
 * ```
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function fade(): TAnimationPreset {
	return {
		name: 'fade',
		enterDurationMs: animationDurations.popoverTransition.enter,
		exitDurationMs: animationDurations.popoverTransition.exit,
	};
}

// scaleAndFade

/**
 * Scale from 0.95 + opacity transition.
 *
 * Suitable for menus, dropdowns, and select options.
 *
 * @example
 * ```tsx
 * import { scaleAndFade } from '@atlaskit/top-layer/animations';
 *
 * <Popover animate={scaleAndFade()} />
 * ```
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function scaleAndFade(): TAnimationPreset {
	return {
		name: 'scale-and-fade',
		enterDurationMs: animationDurations.popoverTransition.enter,
		exitDurationMs: animationDurations.popoverTransition.exit,
	};
}

// dialogMotion

/**
 * Dialog motion animation.
 *
 * Includes backdrop fade animation.
 *
 * @example
 * ```tsx
 * import { dialogMotion } from '@atlaskit/top-layer/animations';
 *
 * <Dialog animate={dialogMotion()} isOpen={isOpen} onClose={handleClose} label="...">
 *   ...
 * </Dialog>
 * ```
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function dialogMotion(): TAnimationPreset {
	// Bare preset name; `Dialog` prefixes it via `data-ds-dialog-{name}`.
	return {
		name: 'motion',
		enterDurationMs: animationDurations.dialogMotion.enter,
		exitDurationMs: animationDurations.dialogMotion.exit,
	};
}

// dialogSlideUpAndFade

type TDialogSlideUpAndFadeOptions = {
	/**
	 * Slide distance in pixels. Defaults to `12`.
	 */
	distance?: number;
};

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
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function dialogSlideUpAndFade(options?: TDialogSlideUpAndFadeOptions): TAnimationPreset {
	const distance = options?.distance ?? 12;

	// Bare preset name; `Dialog` prefixes it via `data-ds-dialog-{name}`.
	// The distance is applied via the `--ds-dialog-ty` custom property rather
	// than baked into the styles, so the name stays stable across distances.
	return {
		name: 'slide-up-and-fade',
		getProperties: () => ({ '--ds-dialog-ty': `${distance}px` }),
		enterDurationMs: animationDurations.dialogTransition.enter,
		exitDurationMs: animationDurations.dialogTransition.exit,
	};
}

// dialogFade

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
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function dialogFade(): TAnimationPreset {
	// Bare preset name; `Dialog` prefixes it via `data-ds-dialog-{name}`.
	return {
		name: 'fade',
		enterDurationMs: animationDurations.dialogTransition.enter,
		exitDurationMs: animationDurations.dialogTransition.exit,
	};
}
