import type { CSSProperties, ReactNode } from 'react';

import type { XCSSProp } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';

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
 * User interactions that are allowed to dismiss the dialog.
 */
export type TDialogDismissedBy = 'none' | 'escape' | 'escape-and-outside-click';

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
	 * Controlled visibility intent for the dialog. Native visibility and lifecycle
	 * phase can temporarily differ from this value while a close settles.
	 *
	 * - `true`: calls `showModal()`. When `shouldAnimate` is `true`, the entry
	 *   animation plays via `@starting-style`.
	 * - `false`: calls `close()`. When `shouldAnimate` is `true`, the exit
	 *   animation plays via `allow-discrete` while the lifecycle phase is `exiting`.
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
	 * Called after the dialog closes through an allowed Escape or backdrop interaction.
	 *
	 * User dismissal cannot be rejected from this callback. The consumer must set
	 * `isOpen={false}` in response to synchronize controlled state with the native dialog.
	 */
	onClose: (args: { reason: TDialogCloseReason }) => void;
	/**
	 * Controls which user actions can dismiss the dialog.
	 *
	 * - `'escape-and-outside-click'`: Escape and outside click.
	 * - `'escape'`: Escape only.
	 * - `'none'`: no user action.
	 *
	 * Defaults to `'escape-and-outside-click'`.
	 */
	dismissedBy?: TDialogDismissedBy;
	/**
	 * Whether the dialog should animate in and out.
	 *
	 * When `true`, default dialog animation styles are applied. Use `enteringAnimationXcss`
	 * and `exitingAnimationXcss` to override the animation used for each phase.
	 */
	shouldAnimate?: boolean;
	/**
	 * Additional Compiled styles applied to the `<dialog>` element.
	 *
	 * Applied after built-in dialog and animation styles so consumers can own
	 * static styling that must live in their package.
	 */
	// Not using `StrictXCSSProp` because it doesn't support `dvh` units for `height` which Drawer uses
	xcss?: XCSSProp<
		| 'margin'
		| 'height'
		| 'width'
		| 'maxWidth'
		| 'insetBlockStart'
		| 'insetInlineStart'
		| 'insetInlineEnd'
		| 'overflow'
		| 'scrollbarGutter',
		never
	>;
	/**
	 * Animation styles applied while the dialog is entering.
	 *
	 * Only applied when `shouldAnimate` is `true`.
	 */
	enteringAnimationXcss?: StrictXCSSProp<
		'animationName' | 'animationDuration' | 'animationTimingFunction' | 'animationDelay',
		never
	>;
	/**
	 * Animation styles applied while the dialog is exiting.
	 *
	 * Only applied when `shouldAnimate` is `true`.
	 */
	exitingAnimationXcss?: StrictXCSSProp<
		'animationName' | 'animationDuration' | 'animationTimingFunction' | 'animationDelay',
		never
	>;
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
	 * Called after the native closed `toggle` and any exit animations settle.
	 * With no animation or reduced motion, this still waits for the browser's
	 * task-queued `toggle` so focus restoration finishes against a mounted host.
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
