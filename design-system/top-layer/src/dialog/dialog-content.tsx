/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	type Ref,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
} from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { token } from '@atlaskit/tokens';

import { useAnimatedVisibility } from '../internal/use-animated-visibility';
import { useFocusWrap } from '../internal/use-focus-wrap';

import { type TDialogProps } from './types';

// These animation styles use the non-strict Compiled cssMap because they rely
// on `@starting-style`, `[open]`, and `allow-discrete`. Keep them in this
// component so the Compiled transform can statically extract every referenced
// style.
const dialogAnimationStyles = cssMap({
	root: {
		transitionProperty: 'overlay, display',
		transitionDuration: token('motion.duration.medium'),
		transitionBehavior: 'allow-discrete',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
		'&[open]': {
			transitionDuration: token('motion.duration.long'),
			transitionTimingFunction: token('motion.easing.inout.bold'),
		},
	},
	motion: {
		animation: token('motion.modal.exit'),
		animationFillMode: 'forwards',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
		'&[open]': {
			animation: token('motion.modal.enter'),
			animationFillMode: 'backwards',
		},
	},
});

const styles = cssMap({
	dialog: {
		// Reset browser defaults
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		border: 'none',
		maxWidth: 'none',
		maxHeight: 'none',
		// Positioning
		margin: 'auto',
		// Override UA background: canvas. The dialog primitive is unopinionated;
		// consumers provide their own background on a child element.
		backgroundColor: 'transparent',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
			transitionDuration: token('motion.duration.instant'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
			'&[open]': {
				animationName: 'none',
				transitionDuration: token('motion.duration.instant'),
			},
		},
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
	motion: {
		'&::backdrop': {
			animation: token('motion.blanket.exit'),
			animationFillMode: 'forwards',
			transitionProperty: 'overlay, display',
			transitionDuration: token('motion.duration.medium'),
			transitionBehavior: 'allow-discrete',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
		'&[open]::backdrop': {
			animation: token('motion.blanket.enter'),
			animationFillMode: 'backwards',
		},
		'@media (prefers-reduced-motion: reduce)': {
			'&::backdrop': {
				animationName: 'none',
				transitionDuration: token('motion.duration.instant'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- the [open] attribute selector targets the dialog's own open state and is required for the open and close animation
			'&[open]::backdrop': {
				animationName: 'none',
				transitionDuration: token('motion.duration.instant'),
			},
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
 * Close flow: we never call `dialog.close()` from event handlers. We always call
 * `onClose`; the consumer decides whether to set `isOpen={false}`.
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
		onEnterFinish,
		onExitFinish,
		animate = false,
		xcss: consumerXcss,
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

	const { phase, preset } = useAnimatedVisibility({
		isOpen,
		animationKind: 'dialog',
		animate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// True while the host element is mounted (any phase except `closed`).
	// Used as a dep so listener-rebind effects re-attach after a remount.
	const isVisible = phase !== 'closed';

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
			event.preventDefault();
			onClose({ reason: 'escape' });
		},
		[onClose],
	);

	// Handle backdrop click
	// Attached via bind-event-listener rather than a React prop so we avoid
	// a11y lint suppressions on the <dialog> element.
	// Keyboard dismiss is already handled natively (Escape → onCancel above).
	// `isVisible` is in deps so the listener re-binds to the new <dialog>
	// element after a host unmount / remount cycle.
	useEffect(() => {
		const dialog = ownRef.current;
		if (!dialog) {
			return;
		}

		return bind(dialog, {
			type: 'click',
			listener(event) {
				if (event.target === event.currentTarget) {
					onClose({ reason: 'overlay-click' });
				}
			},
		});
	}, [onClose, isVisible]);

	// Unmount the `<dialog>` once exit completes so it does not leave an
	// empty `role="dialog"` element in the accessibility tree. On the next
	// open the element remounts and the `[isOpen]` and `[onClose, isVisible]`
	// effects re-run against the fresh element.
	if (!isVisible) {
		return null;
	}

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
				styles.dialog,
				shouldHideBackdrop ? backdropStyles.hidden : backdropStyles.root,
				preset && backdropStyles.motion,
				preset && dialogAnimationStyles.root,
				preset && dialogAnimationStyles.motion,
			]}
			style={style}
			onCancel={handleCancel}
			data-testid={testId}
			className={consumerXcss}
		>
			{children}
		</dialog>
	);
});
