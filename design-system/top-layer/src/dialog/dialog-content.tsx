/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type Ref, useCallback, useId, useLayoutEffect, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';
import { bindAll } from 'bind-event-listener';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/use-notify-open-layer-observer';
import { token } from '@atlaskit/tokens';

import { useAnimatedVisibility } from '../internal/use-animated-visibility';
import { useFocusWrap } from '../internal/use-focus-wrap';
import { useSafariEscapeFix } from '../internal/use-safari-escape-fix';

import { type TDialogCloseReason, type TDialogProps } from './types';

// Surface reset — see the rationale on `surfaceResetStyles` in `popover/popover.tsx`.
// Neutralises inherited interaction and text-layout properties (e.g.
// `pointer-events: none` and `white-space: nowrap`) that leak into the top-layer
// surface. Excludes `color`/`font` (theming) and `direction`/`unicode-bidi` (RTL
// must inherit). The reset has no box side-effects, so it does not reintroduce
// the `margin: auto` centering problem that kept `height: auto` off `Dialog`.
//
// KEEP IN SYNC with the identical `surfaceResetStyles` in `popover/popover.tsx`
// (ADS forbids sharing styles across files, so it is co-located and duplicated).
const surfaceResetStyles = cssMap({
	root: {
		pointerEvents: 'auto',
		whiteSpace: 'normal',
		wordBreak: 'normal',
		overflowWrap: 'normal',
		textAlign: 'start',
		textIndent: '0',
		textTransform: 'none',
	},
});

const dialogStyles = cssMap({
	root: {
		// Reset browser defaults
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		border: 'none',
		maxWidth: 'none',
		maxHeight: 'none',
		// Unlike `Popover`, the `Dialog` reset deliberately omits the WebKit
		// flex-collapse fix (`height: auto`): a modal `<dialog>` has UA `inset: 0`,
		// so `height: auto` would stretch it to the viewport and break `margin: auto`
		// centering — a layout opinion this primitive should not impose. The collapse
		// (a `max-height: 100%` flex column in a bare `<dialog>`) is the consumer's to
		// handle. See notes/decisions/safari-popover-flex-collapse.md
		// Positioning
		margin: 'auto',
		// Override UA background: canvas. The dialog primitive is unopinionated;
		// consumers provide their own background on a child element.
		backgroundColor: 'transparent',
	},
	motion: {
		// This transition keeps the element visible and in the top layer while the
		// exit animation plays. It needs to be always applied because there can
		// be a delay before entering the `exiting` phase after the dialog is dismissed.
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

/**
 * Low-level `<dialog>` primitive. No visual opinions - no width, height,
 * background, border-radius, or layout. Consumers provide their own styling.
 *
 * Visibility is controlled declaratively via `isOpen`:
 * - `isOpen={true}` calls `.showModal()` (entry animation via `@starting-style`)
 * - `isOpen={false}` calls `.close()` (exit animation via `allow-discrete`)
 *
 * Handles native `cancel` event (Escape) and backdrop click detection.
 *
 * Close flow: allowed user dismissal closes the native dialog before `onClose`
 * notifies the consumer. The consumer must synchronize `isOpen` in response.
 *
 * Accessibility: render at least one focusable element (typically a close
 * button) when `isOpen` becomes `true`. Tab is always trapped inside the
 * dialog, so keyboard users need somewhere to land.
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
	const closeReasonRef = useRef<TDialogCloseReason | null>(null);
	const dismissedByRef = useRef(dismissedBy);
	const onCloseRef = useRef(onClose);
	// Keep native event handlers stable while ensuring they read the latest committed props.
	useLayoutEffect(() => {
		dismissedByRef.current = dismissedBy;
		onCloseRef.current = onClose;
	}, [dismissedBy, onClose]);

	const { phase, isMounted, onBeforeToggle, onToggle } = useAnimatedVisibility({
		isOpen,
		shouldAnimate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// Ordering is important: bind native lifecycle listeners before the later
	// layout effect calls showModal() or close(), because `beforetoggle` fires
	// synchronously during those calls.
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
				// Browsers retarget clicks on ::backdrop to the <dialog> element.
				// Close on backdrop click when outside-click dismissal is enabled.
				type: 'click',
				listener(event) {
					if (
						event.target === event.currentTarget &&
						dismissedByRef.current === 'escape-and-outside-click'
					) {
						closeReasonRef.current = 'overlay-click';
						dialog.close();
					}
				},
			},
			{
				type: 'toggle',
				listener(event) {
					if (event.newState === 'closed') {
						const reason = closeReasonRef.current;
						closeReasonRef.current = null;
						// A reason is only set for user-initiated closes. When React closes the
						// dialog because isOpen changed, the consumer already knows.
						if (reason) {
							onCloseRef.current({ reason });
						}
					}

					onToggle(event);
				},
			},
		]);
	}, [isMounted, onBeforeToggle, onToggle]);

	// Native `<dialog>.showModal()` traps focus but wraps through `<body>` at
	// the boundary (A → B → C → body → A). This hook intercepts Tab to wrap
	// directly (A → B → C → A), matching the WAI-ARIA APG pattern. Passing
	// `phase` keeps the listener attached through the animated-exit window
	// (WCAG 2.4.3 Focus Order regression guard).
	useFocusWrap({ elementRef: ownRef, role: 'dialog', phase });

	// Notify the open layer observer so app-coordination features
	// (open-count subscriptions) work with top-layer dialogs.
	useNotifyOpenLayerObserver({
		type: 'modal',
		isOpen,
		// No-op: no current use case for programmatic close via OpenLayerObserver.
		onClose: noop,
	});

	useLayoutEffect(() => {
		const dialog = ownRef.current;
		if (!dialog) {
			return;
		}

		if (isOpen) {
			closeReasonRef.current = null;
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

	// Safari bug: escape closes open dialog and popovers, rather than just innermost popover
	// See notes/decisions/safari-escape-nested-popover-in-dialog.md
	const { shouldIgnoreEscape } = useSafariEscapeFix({
		dialogRef: ownRef,
		isVisible: isMounted,
	});

	// Handle native Escape (cancel event)
	const handleCancel = useCallback(
		(event: React.SyntheticEvent<HTMLDialogElement>) => {
			// Only handle a cancel targeting THIS dialog. Native `cancel` does not
			// bubble, but React's synthetic event bubbles up the component tree, so
			// for nested dialogs (one rendered inside another's DOM subtree) the
			// inner dialog's Escape would otherwise also fire an ancestor dialog's
			// handler and close it too. Mirrors the backdrop-click target guard below.
			if (event.target !== event.currentTarget) {
				return;
			}

			// Spurious Safari `cancel`: the keydown snapshot saw an open child
			// popover, so this Escape belongs to that popover (light-dismissed
			// natively). Keep the dialog open instead of forwarding to `onClose`.
			if (shouldIgnoreEscape()) {
				event.preventDefault();
				return;
			}

			// Without native `closedby`, cancel Escape only when dismissal is disabled.
			// Allowed dismissal follows Popover behavior: the browser closes the element
			// and `onClose` notifies the controlled owner of the reason.
			if (dismissedBy === 'none') {
				event.preventDefault();
				return;
			}

			closeReasonRef.current = 'escape';
		},
		[dismissedBy, shouldIgnoreEscape],
	);

	// Unmount the `<dialog>` once exit completes so it does not leave an
	// empty `role="dialog"` element in the accessibility tree. A later open
	// remounts a fresh element, so the listener-binding and native-visibility
	// effects run against that element.
	if (!isMounted) {
		return null;
	}

	const shouldAnimateBackdrop = !shouldHideBackdrop && shouldAnimate;

	return (
		<dialog
			ref={combinedRef}
			id={dialogId}
			// `aria-modal` is intentionally NOT set: native `<dialog>.showModal()`
			// already conveys modal semantics to assistive tech, and double-
			// declaring it forecloses non-modal use cases (consumers calling
			// `.show()` would still appear modal). Modern AT (NVDA / JAWS /
			// VoiceOver) infer modality from the platform accessibility API.
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
			onCancel={handleCancel}
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
