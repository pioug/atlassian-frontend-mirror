import type { TAnimationPreset } from '../internal/use-animated-visibility';

// `custom` variant currently exists for typing reasons for Drawer
// not indicative of final API
export type TDialogAnimationPresetName = 'motion' | 'slide-up-and-fade' | 'fade' | 'custom';

export type TDialogAnimationPreset = TAnimationPreset<'dialog', TDialogAnimationPresetName>;

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
export function dialogMotion(): TDialogAnimationPreset {
	return {
		kind: 'dialog',
		name: 'motion',
	};
}

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
export function dialogSlideUpAndFade(options?: {
	/**
	 * Slide distance in pixels. Defaults to `12`.
	 */
	distance?: number;
}): TDialogAnimationPreset {
	const distance = options?.distance ?? 12;

	// The configurable distance is applied via the `--ds-dialog-ty` custom property
	return {
		kind: 'dialog',
		name: 'slide-up-and-fade',
		getStyles: () => [{ property: '--ds-dialog-ty', value: `${distance}px` }],
	};
}

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
export function dialogFade(): TDialogAnimationPreset {
	return {
		kind: 'dialog',
		name: 'fade',
	};
}
