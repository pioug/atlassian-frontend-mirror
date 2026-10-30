/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type Ref, useCallback, useId, useRef } from 'react';
import { flushSync } from 'react-dom';

import { cssMap, cx, jsx } from '@compiled/react';
import { bindAll } from 'bind-event-listener';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import { token } from '@atlaskit/tokens';

import { isNativeElementOpen } from '../internal/is-native-element-open';
import type { TBoostedSurfaceResetCheck } from '../internal/surface-reset';
import { useAnimatedVisibility } from '../internal/use-animated-visibility';
import { useFocusWrap } from '../internal/use-focus-wrap';
import { type TDialogDismissedBy, type TDialogProps } from './types';
import { useBackdropClick } from './use-backdrop-click';
import { useCancelFallback } from './use-cancel-fallback';
import { useEscapeKeydown } from './use-escape-keydown';

/**
 * **Surface reset**, including `color` (the UA `dialog` rule sets `CanvasText`).
 *
 * KEEP IN SYNC with `surfaceResetStyles` in `popover/popover.tsx`.
 */
const surfaceResetStyles = cssMap({
	root: {
		// Host boost, see `dialogStyles.root`.
		'&:defined:defined:defined': {
			pointerEvents: 'auto',
			whiteSpace: 'normal',
			wordBreak: 'normal',
			overflowWrap: 'normal',
			textAlign: 'start',
			textIndent: '0',
			textTransform: 'none',
			color: token('color.text'),
		},
	},
});

// Compile-time check that this copy matches `TBoostedSurfaceReset` in `internal/surface-reset.tsx`.
true satisfies TBoostedSurfaceResetCheck<
	typeof surfaceResetStyles.root,
	'&:defined:defined:defined'
>;

const dialogStyles = cssMap({
	root: {
		/**
		 * `margin` and `maxWidth` are in the `xcss` union, so they stay unboosted.
		 *
		 * No `height: auto` (unlike `Popover`): with the UA `inset: 0`, it stretches the dialog.
		 * See `notes/decisions/safari-popover-flex-collapse.md`.
		 */
		margin: 'auto',
		maxWidth: 'none',
		/**
		 * **Host specificity boost**
		 *
		 * (0,4,0), so consumer rules like `.page > dialog` lose. The 9 `xcss`
		 * properties (see `types.tsx`) stay unboosted so `xcss` still wins.
		 * `:defined` always matches a built-in element, so the boost holds in every
		 * state. `<dialog>` has no always-present attribute (`[open]` drops on close).
		 * A rendered `[data-*]` attribute would also work, if we want one.
		 * See `styles.root` in `popover/popover.tsx`.
		 */
		'&:defined:defined:defined': {
			paddingBlockStart: token('space.0'),
			paddingInlineEnd: token('space.0'),
			paddingBlockEnd: token('space.0'),
			paddingInlineStart: token('space.0'),
			border: 'none',
			minWidth: 'auto',
			minHeight: 'auto',
			maxHeight: 'none',
			alignSelf: 'normal',
			justifySelf: 'normal',
			transform: 'none',
			translate: 'none',
			scale: 'none',
			rotate: 'none',
			opacity: 1,
			// UA modal values, which Chromium keeps during the exit.
			position: 'fixed',
			insetBlockEnd: 0,
			// Unstyled; consumers apply their own surface.
			backgroundColor: 'transparent',
		},
		// Keyed on `[open]` so it never beats the UA closed `display: none`.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- host boost, see above
		'&[open][open][open]': {
			display: 'block',
		},
	},
	motion: {
		// Keeps the dialog visible and in the top layer while the exit animation plays. Applied in
		// every phase, because the `exiting` phase can start some time after the native close.
		transitionProperty: 'overlay, display',
		transitionDuration: token('motion.duration.medium'),
		transitionBehavior: 'allow-discrete',
		animationFillMode: 'both',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
			transitionDuration: token('motion.duration.instant'),
		},
	},
	enter: {
		animation: token('motion.modal.enter'),
	},
	exit: {
		animation: token('motion.modal.exit'),
	},
});

const backdropStyles = cssMap({
	root: {
		'&::backdrop': {
			backgroundColor: token('color.blanket'),
		},
	},
	hidden: {
		'&::backdrop': {
			backgroundColor: 'transparent',
		},
	},
	enter: {
		'&::backdrop': {
			animation: token('motion.blanket.enter'),
		},
	},
	exit: {
		'&::backdrop': {
			animation: token('motion.blanket.exit'),
		},
	},
});

function isEscapeAllowed({ dismissedBy }: { dismissedBy: TDialogDismissedBy }): boolean {
	return dismissedBy === 'escape' || dismissedBy === 'escape-and-outside-click';
}

function isBackdropClickAllowed({ dismissedBy }: { dismissedBy: TDialogDismissedBy }): boolean {
	return dismissedBy === 'escape-and-outside-click';
}

// Whether every `<dialog>` and `[popover]` that contains the node is open. Crosses shadow roots.
function isEveryAncestorLayerOpen({ node }: { node: Node }): boolean {
	const parent = node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentElement;
	if (!parent) {
		return true;
	}
	if (
		parent instanceof HTMLElement &&
		(parent instanceof HTMLDialogElement || parent.hasAttribute('popover')) &&
		!isNativeElementOpen({ element: parent })
	) {
		return false;
	}
	return isEveryAncestorLayerOpen({ node: parent });
}

/**
 * Safety net for a close that `Dialog` did not ask about (for example `dialog.close()` or a
 * `<form method="dialog">` submit). Consumers should not close the native dialog. `isOpen` is the
 * source of truth, so show the dialog again.
 *
 * Skipped inside a closed layer: an open modal there is invisible but still makes the page inert.
 *
 * Returns `true` when this call showed the dialog again.
 */
function reopenAfterUnaskedClose({ dialog }: { dialog: HTMLDialogElement }): boolean {
	if (dialog.open || !isEveryAncestorLayerOpen({ node: dialog })) {
		return false;
	}
	try {
		dialog.showModal();
	} catch {
		return false;
	}
	return dialog.open;
}

/**
 * Low-level `<dialog>` primitive. It has no visual opinions: no width, height, background,
 * border-radius or layout. Consumers provide their own styling.
 *
 * `isOpen` controls visibility. When the user asks to dismiss the dialog (an allowed Escape or
 * backdrop click), `onClose` runs. Set `isOpen={false}` to close it, or keep `isOpen` `true` to
 * keep it open, in every browser.
 *
 * **How closing works**
 *
 * - Standard path: the `<dialog>` has `closedby="none"`, so the browser never closes it for a
 *   user action. `Dialog` listens for Escape (`useEscapeKeydown`) and backdrop clicks
 *   (`useBackdropClick`) itself, and asks through `onClose`. Other close requests (for example
 *   Android back) go past the dialog.
 * - Fallback: browsers without `closedby` (Safari 27 and earlier) still send `cancel` for close
 *   requests. `useCancelFallback` refuses them. It binds only in those browsers.
 * - Do not close the native dialog directly (`dialog.close()`, `<form method="dialog">`). If it
 *   closes while `isOpen` is `true`, `Dialog` shows it again and does not call `onClose`.
 *
 * See `notes/decisions/dialog-close-flow.md`.
 *
 * **Accessibility**
 *
 * Render at least one focusable element (typically a close button) when `isOpen` becomes `true`.
 * `Dialog` always traps Tab inside the dialog, so keyboard users need somewhere to land.
 */
export const Dialog: React.ForwardRefExoticComponent<
	TDialogProps & React.RefAttributes<HTMLDialogElement>
> = forwardRef<HTMLDialogElement, TDialogProps>(function Dialog(
	{
		children,
		isOpen,
		onClose,
		dismissedBy = 'escape-and-outside-click',
		onEnterFinish,
		onExitFinish,
		shouldAnimate = false,
		xcss: consumerXcss,
		enteringAnimationXcss,
		exitingAnimationXcss,
		style,
		testId,
		id: providedId,
		label,
		labelledBy,
		shouldHideBackdrop,
	}: TDialogProps,
	ref,
) {
	const generatedId = useId();
	const dialogId = providedId ?? generatedId;
	const ownRef = useRef<HTMLDialogElement>(null);
	const combinedRef = mergeRefs([ownRef, ref as Ref<HTMLDialogElement>]);
	const dismissedByRef = useRef(dismissedBy);
	const onCloseRef = useRef(onClose);
	const isOpenRef = useRef(isOpen);
	// Keep native event handlers stable while ensuring they read the latest committed props.
	useLayoutEffect(() => {
		dismissedByRef.current = dismissedBy;
		onCloseRef.current = onClose;
		isOpenRef.current = isOpen;
	}, [dismissedBy, onClose, isOpen]);

	const { phase, isMounted, onBeforeToggle, onToggle } = useAnimatedVisibility({
		isOpen,
		shouldAnimate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// Bind the lifecycle listeners before the `isOpen` effect below calls `showModal()` or
	// `close()`: `beforetoggle` fires synchronously during those calls.
	useLayoutEffect(() => {
		if (!isMounted) {
			return;
		}

		const dialog = ownRef.current;
		if (!dialog) {
			return;
		}

		return bindAll(dialog, [
			{ type: 'beforetoggle', listener: onBeforeToggle },
			{
				type: 'toggle',
				listener(event) {
					// The consumer unmounted the dialog in `onClose`. Do not schedule
					// `onExitFinish` after unmount.
					if (!dialog.isConnected) {
						return;
					}
					// Safety net: something closed the native dialog while `isOpen` is `true`, so
					// show it again. Runs before `onToggle`, so the exit never settles.
					if (
						event.newState === 'closed' &&
						isOpenRef.current &&
						reopenAfterUnaskedClose({ dialog })
					) {
						return;
					}
					onToggle(event);
				},
			},
		]);
	}, [isMounted, onBeforeToggle, onToggle]);

	// Native `<dialog>.showModal()` traps focus but wraps through `<body>` at the boundary
	// (A → B → C → body → A). `useFocusWrap` handles Tab and wraps directly (A → B → C → A), as in
	// the WAI-ARIA APG pattern. `phase` keeps the listener during the exit animation (WCAG 2.4.3 Focus
	// Order regression guard).
	useFocusWrap({ elementRef: ownRef, role: 'dialog', phase });

	// Show or close the native dialog to match `isOpen`.
	useLayoutEffect(() => {
		const dialog = ownRef.current;
		if (!dialog) {
			return;
		}

		if (isOpen) {
			if (!dialog.open) {
				dialog.showModal();
			}
			return () => {
				if (dialog.open) {
					dialog.close();
				}
			};
		}

		if (dialog.open) {
			dialog.close();
		}
	}, [isOpen]);

	// Standard path: Escape.
	const handleEscape = useCallback(() => {
		if (!isEscapeAllowed({ dismissedBy: dismissedByRef.current })) {
			return;
		}
		// Commit the consumer's `isOpen` answer before the keydown ends.
		flushSync(() => {
			onCloseRef.current({ reason: 'escape' });
		});
	}, []);
	useEscapeKeydown({ dialogRef: ownRef, isMounted, onEscape: handleEscape });

	// Standard path: backdrop click.
	const handleBackdropClick = useCallback(() => {
		if (!isBackdropClickAllowed({ dismissedBy: dismissedByRef.current })) {
			return;
		}
		// Commit the consumer's `isOpen` answer before the click ends.
		flushSync(() => {
			onCloseRef.current({ reason: 'overlay-click' });
		});
	}, []);
	useBackdropClick({ dialogRef: ownRef, isMounted, onBackdropClick: handleBackdropClick });

	// Fallback: only in browsers without `closedby`.
	useCancelFallback({ dialogRef: ownRef, isMounted });

	// After the exit, render nothing, so no empty `role="dialog"` element stays in the accessibility
	// tree. The next open mounts a new `<dialog>`, and the effects above run again for it.
	if (!isMounted) {
		return null;
	}

	const shouldAnimateBackdrop = !shouldHideBackdrop && shouldAnimate;

	return (
		<dialog
			ref={combinedRef}
			id={dialogId}
			// No `aria-modal`: `showModal()` already tells assistive technology that the dialog is
			// modal (NVDA, JAWS and VoiceOver read it from the platform accessibility API). With
			// `aria-modal`, a dialog opened with `show()` would also appear modal.
			aria-label={label}
			aria-labelledby={label ? undefined : labelledBy}
			css={[
				// Dialog styles
				dialogStyles.root,
				surfaceResetStyles.root,
				shouldAnimate && phase === 'entering' && dialogStyles.enter,
				shouldAnimate && phase === 'exiting' && dialogStyles.exit,
				shouldAnimate && dialogStyles.motion,
				// Backdrop styles
				shouldHideBackdrop ? backdropStyles.hidden : backdropStyles.root,
				shouldAnimateBackdrop && phase === 'entering' && backdropStyles.enter,
				shouldAnimateBackdrop && phase === 'exiting' && backdropStyles.exit,
			]}
			style={style}
			// The browser never closes the dialog for a user action. `Dialog` handles Escape and
			// backdrop clicks itself. Always `none` (no feature check), so the server and the client
			// render the same markup.
			closedby="none"
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(
				consumerXcss,
				shouldAnimate && phase === 'entering' && enteringAnimationXcss,
				shouldAnimate && phase === 'exiting' && exitingAnimationXcss,
			)}
		>
			{children}
		</dialog>
	);
});
