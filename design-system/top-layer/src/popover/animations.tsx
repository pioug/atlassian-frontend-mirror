import { token } from '@atlaskit/tokens';

import { getPlacement, type TPlacementOptions } from '../internal/resolve-placement';
import type { TAnimationPreset } from '../internal/use-animated-visibility';

export type TPopoverAnimationPresetName = 'motion' | 'slide-and-fade' | 'scale-and-fade' | 'fade';

export type TPopoverAnimationPreset = TAnimationPreset<'popover', TPopoverAnimationPresetName>;

function getPopupMotionStyles({
	placement,
}: {
	placement: TPlacementOptions;
}): Array<{ property: string; value: string }> {
	const { axis, edge } = getPlacement({ placement });

	if (axis === 'block' && edge === 'start') {
		return [
			{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.top') },
			{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.top') },
		];
	}
	if (axis === 'inline' && edge === 'start') {
		return [
			{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.left') },
			{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.left') },
		];
	}
	if (axis === 'inline' && edge === 'end') {
		return [
			{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.right') },
			{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.right') },
		];
	}
	// Default: block/end (popover below trigger)
	return [
		{ property: '--ds-popover-motion-enter', value: token('motion.popup.enter.bottom') },
		{ property: '--ds-popover-motion-exit', value: token('motion.popup.exit.bottom') },
	];
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function popupMotion(): TPopoverAnimationPreset {
	return {
		kind: 'popover',
		name: 'motion',
		getStyles: getPopupMotionStyles,
	};
}

function getSlideAndFadeStyles({
	placement,
	distance,
}: {
	placement: TPlacementOptions;
	distance: number;
}): Array<{ property: string; value: string }> {
	const pos = `${distance}px`;
	const neg = `-${distance}px`;
	const { axis, edge } = getPlacement({ placement });

	if (axis === 'block' && edge === 'start') {
		return [
			{ property: '--ds-popover-tx', value: '0' },
			{ property: '--ds-popover-ty', value: pos },
		];
	}
	if (axis === 'block' && edge === 'end') {
		return [
			{ property: '--ds-popover-tx', value: '0' },
			{ property: '--ds-popover-ty', value: neg },
		];
	}
	if (axis === 'inline' && edge === 'start') {
		return [
			{ property: '--ds-popover-tx', value: pos },
			{ property: '--ds-popover-ty', value: '0' },
		];
	}
	if (axis === 'inline' && edge === 'end') {
		return [
			{ property: '--ds-popover-tx', value: neg },
			{ property: '--ds-popover-ty', value: '0' },
		];
	}

	return [
		{ property: '--ds-popover-tx', value: '0' },
		{ property: '--ds-popover-ty', value: neg },
	];
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
export function slideAndFade(options?: { distance?: number }): TPopoverAnimationPreset {
	const distance = options?.distance ?? 4;

	return {
		kind: 'popover',
		name: 'slide-and-fade',
		getStyles: ({ placement }: { placement: TPlacementOptions }) =>
			getSlideAndFadeStyles({ placement, distance }),
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
export function fade(): TPopoverAnimationPreset {
	return {
		kind: 'popover',
		name: 'fade',
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
export function scaleAndFade(): TPopoverAnimationPreset {
	return {
		kind: 'popover',
		name: 'scale-and-fade',
	};
}
