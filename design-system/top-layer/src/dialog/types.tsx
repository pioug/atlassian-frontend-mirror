import { type CSSProperties, type ReactNode } from 'react';

import { type TAnimationPreset } from '../animations/types';

/**
 * Close reasons produced by the Dialog primitive.
 *
 * - `'escape'` — user pressed Escape (native `cancel` event on `<dialog>`).
 * - `'overlay-click'` — user clicked the backdrop / overlay area.
 *
 * Consumer-initiated ("programmatic") close is not a reason the primitive
 * produces — the consumer simply sets `isOpen={false}`.
 */
export type TDialogCloseReason = 'escape' | 'overlay-click';

/**
 * Props for the `Dialog` primitive.
 *
 * Low-level wrapper around the native `<dialog>` element.
 * Manages visibility (`showModal()` / `close()`), animation, Escape handling,
 * and backdrop-click detection. Has no visual opinions — no width, height,
 * background, border-radius, or layout. Consumers (e.g. `@atlaskit/modal-dialog`)
 * provide their own visual styling.
 */
export type TDialogProps = {
	children: ReactNode;
	/**
	 * Whether the dialog is open.
	 *
	 * - `true`: calls `showModal()`, entry animation plays via `@starting-style`.
	 * - `false`: calls `close()`. When an `animate` preset is provided, the exit
	 *   animation plays (via `allow-discrete`) before the dialog becomes logically closed.
	 *
	 * The element stays mounted in the DOM — visibility is controlled declaratively.
	 */
	isOpen: boolean;
	/**
	 * Called when the user triggers close via Escape or backdrop click.
	 *
	 * The dialog does **not** close itself — the consumer decides whether to
	 * set `isOpen={false}` (e.g. gate by reason).
	 */
	onClose: (args: { reason: TDialogCloseReason }) => void;
	/**
	 * Animation preset for entry/exit transitions.
	 *
	 * Pass an `TAnimationPreset` (e.g. `dialogSlideUpAndFade()`) to enable
	 * CSS-based entry and exit animation. Pass `false` (or omit) to disable.
	 */
	animate?: TAnimationPreset | false;
	/**
	 * Additional inline styles applied to the `<dialog>` element.
	 *
	 * Use for custom width, height, transform, or other overrides.
	 */
	style?: CSSProperties;
	/**
	 * Test ID applied to the `<dialog>` element.
	 */
	testId?: string;
	/**
	 * HTML `id` attribute for the `<dialog>` element.
	 */
	id?: string;
	/**
	 * Accessible label (`aria-label`).
	 *
	 * When provided, `aria-labelledby` is not set.
	 * Use when there is no visible title element to reference.
	 */
	label?: string;
	/**
	 * ID of the element that labels the dialog (`aria-labelledby`).
	 *
	 * Ignored when `label` is provided.
	 */
	// This is an element ID for aria-labelledby, not translatable text.
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	labelledBy?: string;
	/**
	 * When true, the `::backdrop` pseudo-element is rendered transparent.
	 *
	 * Useful for stacked dialogs where only the foreground dialog should
	 * show a visible backdrop, or when the consumer wants no overlay.
	 */
	shouldHideBackdrop?: boolean;
	/**
	 * Called after the exit animation completes (or immediately on close when
	 * there is no animation or reduced motion is active).
	 *
	 * Use this for external lifecycle coordination — e.g. firing an
	 * `onCloseComplete` callback or notifying ExitingPersistence.
	 */
	onExitFinish?: () => void;
};
