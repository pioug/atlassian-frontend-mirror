import { type CSSProperties, type ReactNode } from 'react';

import { type TAnimationPreset } from '../animations/types';

/**
 * Close reasons produced by the Dialog primitive.
 *
 * - `'escape'`: user pressed Escape (native `cancel` event on `<dialog>`).
 * - `'overlay-click'`: user clicked the backdrop / overlay area.
 *
 * Consumer-initiated ("programmatic") close is not a reason the primitive
 * produces. The consumer simply sets `isOpen={false}`.
 */
export type TDialogCloseReason = 'escape' | 'overlay-click';

/**
 * Props shared across `TDialogProps` variants.
 *
 * The accessible-name requirement (one of `label` or `labelledBy`) is encoded
 * in the discriminated union below - WCAG 4.1.2 violations are caught at
 * compile time instead of in production audit reports.
 */
type TDialogBaseProps = {
	children: ReactNode;
	/**
	 * Whether the dialog is open.
	 *
	 * - `true`: calls `showModal()`, entry animation plays via `@starting-style`.
	 * - `false`: calls `close()`. When an `animate` preset is provided, the exit
	 *   animation plays (via `allow-discrete`) before the dialog becomes logically closed.
	 *
	 * **Lifecycle observable to consumers:**
	 *
	 * - The `<dialog>` host element is in the DOM only while open or its exit
	 *   animation is playing. After exit completes the element is unmounted so
	 *   it does not leave an empty `role="dialog"` element in the accessibility
	 *   tree. The exact unmount timing is private and may change.
	 * - The `id` (supplied or generated) is stable across opens.
	 * - The `ref` is populated only while the host element is rendered. Consumers
	 *   that read from the ref should gate the read on `isOpen` being `true`.
	 */
	isOpen: boolean;
	/**
	 * Called when the user triggers close via Escape or backdrop click.
	 *
	 * The dialog does **not** close itself. The consumer decides whether to
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
	 * When true, the `::backdrop` pseudo-element is rendered transparent.
	 *
	 * Useful for stacked dialogs where only the foreground dialog should
	 * show a visible backdrop, or when the consumer wants no overlay.
	 */
	shouldHideBackdrop?: boolean;
	/**
	 * Called after the entry animation completes (or immediately on open when
	 * there is no animation or reduced motion is active). Also fires on initial
	 * mount with `isOpen={true}`.
	 *
	 * Use this for external lifecycle coordination, e.g. firing an
	 * `onOpenComplete` callback once the dialog has finished animating in.
	 */
	onEnterFinish?: () => void;
	/**
	 * Called after the exit animation completes (or immediately on close when
	 * there is no animation or reduced motion is active).
	 *
	 * Use this for external lifecycle coordination, e.g. firing an
	 * `onCloseComplete` callback or notifying ExitingPersistence.
	 */
	onExitFinish?: () => void;
};

/**
 * Props for the `Dialog` primitive.
 *
 * Low-level wrapper around the native `<dialog>` element.
 * Manages visibility (`showModal()` / `close()`), animation, Escape handling,
 * and backdrop-click detection. Has no visual opinions - no width, height,
 * background, border-radius, or layout. Consumers (e.g. `@atlaskit/modal-dialog`)
 * provide their own visual styling.
 *
 * Discriminated on the accessible-name source: at least one of `label`
 * (aria-label) or `labelledBy` (aria-labelledby) must be provided. This
 * enforces WCAG 4.1.2 at the type level - an unlabelled dialog landmark
 * is not constructible. Mirrors the pattern used by `TPopupContentProps`.
 */
export type TDialogProps = TDialogBaseProps &
	(
		| {
				/**
				 * Accessible label (`aria-label`).
				 *
				 * When provided, `aria-labelledby` is not set.
				 * Use when there is no visible title element to reference.
				 */
				label: string;
				/**
				 * ID of the element that labels the dialog (`aria-labelledby`).
				 *
				 * Ignored when `label` is provided.
				 */
				// This is an element ID for aria-labelledby, not translatable text.
				// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
				labelledBy?: string;
		  }
		| {
				/**
				 * Accessible label (`aria-label`).
				 *
				 * Optional when `labelledBy` is provided.
				 */
				label?: string;
				/**
				 * ID of the element that labels the dialog (`aria-labelledby`).
				 */
				// This is an element ID for aria-labelledby, not translatable text.
				// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
				labelledBy: string;
		  }
	);
