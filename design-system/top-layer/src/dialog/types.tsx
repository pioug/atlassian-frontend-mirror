import type { CSSProperties, ReactNode } from 'react';

import type { XCSSProp } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';

/**
 * Why the user asked to dismiss the dialog.
 *
 * - `'escape'`: the user pressed Escape.
 * - `'overlay-click'`: the user clicked the backdrop.
 *
 * To close the dialog yourself, set `isOpen={false}`. This does not call `onClose`.
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
	 * Whether the dialog is open. Set it to `false` to close the dialog. When
	 * `shouldAnimate` is `true`, the entry and exit animations play.
	 *
	 * - The `<dialog>` element is in the DOM only while the dialog is open or its
	 *   exit animation plays.
	 * - The `id` (supplied or generated) stays the same across opens.
	 * - The `ref` is set only while the `<dialog>` element is rendered. Read it
	 *   only while `isOpen` is `true`.
	 */
	isOpen: boolean;
	/**
	 * Called when the user asks to dismiss the dialog (an allowed Escape or backdrop click).
	 * Set `isOpen={false}` to close it, or keep `isOpen` `true` to keep it open. You can
	 * refuse any number of times, in every browser.
	 *
	 * Other close requests (for example the Android back button) do not call `onClose` and do not
	 * close the dialog. On Android, back navigates as if the dialog was not there.
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
	 * Called after the dialog has closed and its exit animation (if any) has finished.
	 *
	 * Use this for external lifecycle coordination, e.g. firing an
	 * `onCloseComplete` callback or notifying ExitingPersistence.
	 *
	 * A call while `isOpen` is `true` means the dialog closed without `Dialog` asking (for
	 * example `dialog.close()` through the ref, or a `<form method="dialog">` submit) and
	 * `Dialog` could not show it again: a layer that contains it is closed, or `showModal()`
	 * failed. It stays closed until `isOpen` changes. Otherwise `Dialog` shows it again at once
	 * and does not call `onExitFinish`.
	 */
	onExitFinish?: () => void;
};

/**
 * Props for the `Dialog` primitive.
 *
 * Low-level modal dialog. Manages visibility, animation, Escape and backdrop
 * clicks. Has no visual opinions - no width, height,
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
