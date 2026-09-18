/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';

import { cssMap as compiledCssMap, css, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';
import FocusLock from 'react-focus-lock';
import ScrollLock, { TouchScrollable } from 'react-scrolllock';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import Blanket from '@atlaskit/blanket/blanket';
import { cssMap } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { useId } from '@atlaskit/ds-lib/use-id';
import { Layering } from '@atlaskit/layering/layering';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/use-notify-open-layer-observer';
import Motion from '@atlaskit/motion/entering/motion';
import { useExitingPersistence } from '@atlaskit/motion/exiting-persistence/use-exiting-persistence';
import FadeIn from '@atlaskit/motion/fade-in';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Portal from '@atlaskit/portal/portal';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/utils/combine';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import type { CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens/constants';
import { createCloseEvent } from '@atlaskit/top-layer/create-close-event';
import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';
import type { TDialogCloseReason } from '@atlaskit/top-layer/dialog/types';

import type { KeyboardOrMouseEvent, ModalDialogProps, WidthNames } from '../../types';
import { ModalContext } from '../context';
import useModalStack from '../hooks/use-modal-stack';
import usePreventProgrammaticScroll from '../hooks/use-prevent-programmatic-scroll';
import { disableDraggingToCrossOriginIFramesForElement } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
import { disableDraggingToCrossOriginIFramesForExternal } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
import { disableDraggingToCrossOriginIFramesForTextSelection } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';
import { ScrollContext } from '../scroll-context';
import type { InternalModalWrapperProps } from '../types';
import { width } from '../width';
import { default as ModalDialog } from './modal-dialog';

export type { ModalDialogProps };

const fillScreenStyles = css({
	width: '100vw',
	height: '100vh',

	position: 'fixed',
	insetBlockStart: token('space.0'),
	insetInlineStart: token('space.0'),

	overflowY: 'auto',
	WebkitOverflowScrolling: 'touch',
});

/**
 * Styles applied to the <dialog> wrapper, NOT the visual modal surface.
 */
const dialogStyles = compiledCssMap({
	'body-scroll': {
		// Need visible overflow otherwise the box-shadow is clipped
		overflow: 'visible',
		margin: '0px',
		'@media (min-width: 30rem)': {
			margin: '60px auto',
		},
	},
	'viewport-scroll': {
		// Prevents horizontal movement from scrollbar show/hide
		scrollbarGutter: 'stable',
		// We want the dialog to be the whole viewport so the scrolling is on the whole viewport
		width: '100vw',
		height: '100vh',
	},
	'full-screen': {},
});

// Visual styles for modal content inside native <dialog>.
// Uses cssMap (not css) to avoid triggering no-nested-styles lint rule.

const LOCAL_CURRENT_SURFACE_CSS_VAR: typeof CURRENT_SURFACE_CSS_VAR =
	'--ds-elevation-surface-current';

/**
 * Styles applied to the visual modal surface.
 */
const surfaceStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',

		backgroundColor: token('elevation.surface.overlay'),
		color: token('color.text'),
		[LOCAL_CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay'),
		pointerEvents: 'auto',

		'@media (min-width: 30rem)': {
			boxShadow: token('elevation.shadow.overlay'),
		},

		// Focus ring fallback. The wrapper has no `tabIndex`, so this
		// only matches if a consumer explicitly focuses the element via
		// JS - kept for parity with the legacy modal styling.
		'&:focus-visible': {
			outlineColor: token('color.border.focused'),
			// @ts-expect-error -- cssMap types do not accept token return for outlineOffset
			outlineOffset: token('border.width.focused'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused'),
		},

		// Allow scrolling when children are wrapped in a form
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'& > form:only-child': {
			display: 'inherit',
			maxHeight: 'inherit',
			flexDirection: 'inherit',
		},
	},
	borderRadius: {
		borderRadius: 0,
		'@media (min-width: 30rem)': {
			borderRadius: token('radius.xlarge', '12px'),
		},
	},
});

const topLayerScrollModeStyles = compiledCssMap({
	'full-screen': {
		width: '100vw',
		height: '100vh',

		position: 'fixed',
		insetBlockStart: token('space.0'),
		insetInlineStart: token('space.0'),

		overflowY: 'auto',
		WebkitOverflowScrolling: 'touch',
	},
	'viewport-scroll': {
		height: '100vh',
		'@media (min-width: 30rem)': {
			minHeight: 'min-content',
			height: 'var(--modal-dialog-height)',
			width: 'var(--modal-dialog-width)',
			maxWidth: 'calc(100vw - 120px)',
			margin: '60px auto',
		},
	},
	'body-scroll': {
		width: '100vw',
		height: '100vh',
		'@media (min-width: 30rem)': {
			height: 'var(--modal-dialog-height)',
			width: 'var(--modal-dialog-width)',
			maxWidth: 'calc(100vw - 120px)',
		},
	},
});

const topLayerAutoHeightStyles = css({
	'@media (min-width: 30rem)': {
		maxHeight: 'max-content',
	},
});

const allowlistElements = (element: HTMLElement, callback?: (element: HTMLElement) => boolean) => {
	// Allow focus outside modal when AUI dialog is visible
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- legacy FocusLock allowlist
	if (document.querySelector('.aui-blanket:not([hidden])')) {
		return false;
	}
	// Optional callback to let consumers exclude elements from focus lock
	if (typeof callback === 'function') {
		return callback(element);
	}
	return true;
};

// Analytics-wrapped close handler. Extracted so both rendering paths build it
// identically.
function useModalCloseHandler(providedOnClose: InternalModalWrapperProps['onClose']) {
	return usePlatformLeafEventHandler({
		fn: providedOnClose || noop,
		action: 'closed',
		componentName: 'modalDialog',
		packageName: process.env._PACKAGE_NAME_!,
		packageVersion: process.env._PACKAGE_VERSION_!,
	});
}

function getScrollMode({
	shouldScrollInViewport,
	isFullScreen,
}: {
	shouldScrollInViewport: boolean;
	isFullScreen: boolean;
}) {
	if (isFullScreen) {
		return 'full-screen';
	}

	if (shouldScrollInViewport) {
		return 'viewport-scroll';
	}

	return 'body-scroll';
}

function isWidthName(value: string): value is WidthNames {
	return width.values.includes(value);
}

function getTopLayerSurfaceWidth(input: ModalDialogProps['width']) {
	if (!input) {
		return 'auto';
	}

	if (typeof input === 'number') {
		return `${input}px`;
	}

	if (isWidthName(input)) {
		return `${width.widths[input]}px`;
	}

	if (input.endsWith('%')) {
		// Percentage widths need special handling in the top layer.
		// In legacy, the percentage resolved against the Positioner's max-width
		// (100vw - 120px). In the top layer, the <dialog>'s containing block is the
		// viewport (100vw), so a raw percentage would produce a wider modal.
		// Transform e.g. '42%' → 'calc(42 * (100vw - 120px) / 100)' to match legacy.
		return `calc(${parseFloat(input)} * (100vw - 120px) / 100)`;
	}

	return input;
}

function getTopLayerSurfaceHeight(input: ModalDialogProps['height']) {
	if (!input) {
		// Although this value would ordinarily fill the viewport height,
		// there is also a `max-height: max-content` applied to keep it constrained.
		// But we need to provide the modal with a fixed height (non-keyword, non-percentage)
		// in order for child elements with 100% height to work correctly.
		return 'calc(100vh - 120px)';
	}

	if (typeof input === 'number') {
		return `${input}px`;
	}

	if (input.endsWith('%')) {
		// Percentage heights need special handling in the top layer.
		// In legacy, the percentage resolved against the Positioner's max-height
		// (100vh - 120px). In the top layer, the <dialog>'s containing block is the
		// viewport (100vh), so a raw percentage would produce a taller modal.
		// Transform e.g. '42%' → 'calc(42 * (100vh - 120px) / 100)' to match legacy.
		return `calc(${parseFloat(input)} * (100vh - 120px) / 100)`;
	}

	return input;
}

function getDialogDismissedBy({
	shouldCloseOnEscapePress,
	shouldCloseOnOverlayClick,
}: {
	shouldCloseOnEscapePress: boolean;
	shouldCloseOnOverlayClick: boolean;
}): React.ComponentPropsWithoutRef<typeof Dialog>['dismissedBy'] {
	if (shouldCloseOnEscapePress && shouldCloseOnOverlayClick) {
		return 'escape-and-outside-click';
	}
	if (shouldCloseOnEscapePress) {
		return 'escape';
	}
	return 'none';
}

/**
 * Top-layer rendering path (platform-dst-top-layer).
 *
 * Replaces Portal, FocusLock, ScrollLock, Blanket, Positioner, and z-index
 * management with native <dialog> via @atlaskit/top-layer/dialog.
 *
 * Key decisions:
 * - Animation: CSS transitions via @starting-style / allow-discrete.
 * - Close gating: Dialog only forwards allowed reasons.
 * - onClose event param: undefined - consumers should use close reason.
 * - Focus restoration: native <dialog> behavior replaces react-focus-lock's
 *   returnFocus (see accessibility-criteria.md).
 *
 * Every hook here runs unconditionally: this component only mounts on the
 * top-layer path, so it never shares a hook sequence with the legacy path.
 */
function ModalWrapperTopLayer(props: InternalModalWrapperProps): React.ReactNode {
	const {
		autoFocus,
		shouldCloseOnEscapePress = true,
		shouldCloseOnOverlayClick = true,
		shouldScrollInViewport = false,
		shouldReturnFocus = true,
		onClose: providedOnClose,
		onStackChange = noop,
		isBlanketHidden,
		children,
		height,
		width = 'medium',
		onCloseComplete,
		onOpenComplete,
		label,
		testId,
		isFullScreen = false,
	} = props;

	useModalStack({ onStackChange });

	const onCloseHandler = useModalCloseHandler(providedOnClose);

	const { isExiting, onFinish: onExitFinish } = useExitingPersistence();

	// Native <dialog> always restores focus on close - no opt-out via shouldReturnFocus.
	const defaultTestId = testId || 'modal-dialog';

	const id = useId();
	const titleId = `modal-dialog-title-${id}`;

	// Content container ref - used for onOpenComplete/onCloseComplete callbacks.
	const contentRef = useRef<HTMLDivElement>(null);

	// Cache last content element for onCloseComplete after children unmount
	// (with reduced motion, contentRef clears before onExitFinish fires).
	const lastContentElRef = useRef<HTMLDivElement | null>(null);
	if (contentRef.current) {
		lastContentElRef.current = contentRef.current;
	}

	// Native <dialog> ref - needed for ExitingPersistence to call dialog.close().
	const dialogRef = useRef<HTMLDialogElement | null>(null);

	const modalDialogContext = useMemo(
		() => ({
			testId: defaultTestId,
			titleId,
			onClose: onCloseHandler,
			hasProvidedOnClose: Boolean(providedOnClose),
			isFullScreen: isFullScreen ?? false,
		}),
		[defaultTestId, titleId, onCloseHandler, providedOnClose, isFullScreen],
	);

	// Dialog has already applied the close behavior configured by `dismissedBy`.
	// Pass a synthetic event to satisfy the KeyboardOrMouseEvent contract.
	const onDialogClose = useCallback(
		({ reason }: { reason: TDialogCloseReason }) => {
			onCloseHandler(createCloseEvent({ reason }) as unknown as KeyboardOrMouseEvent);
		},
		[onCloseHandler],
	);

	const dismissedBy = getDialogDismissedBy({
		shouldCloseOnEscapePress,
		shouldCloseOnOverlayClick,
	});

	const shouldShimCloseOnOverlayClick = shouldCloseOnOverlayClick && !shouldCloseOnEscapePress;

	// Required until we fully remove `shouldCloseOnEscapePress`.
	// Dialog's `dismissedBy` options do not support outside click without Escape (because it is a bad pattern)
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog || !shouldShimCloseOnOverlayClick) {
			return;
		}

		return bind(dialog, {
			type: 'click',
			listener(event) {
				if (event.target === event.currentTarget) {
					onDialogClose({ reason: 'overlay-click' });
				}
			},
		});
	}, [onDialogClose, shouldShimCloseOnOverlayClick]);

	// ExitingPersistence: isExiting → isOpen={false} → Dialog exit animation →
	// onExitFinish → onCloseComplete + unmount.
	const handleDialogExitFinish = useCallback(() => {
		const el = contentRef.current ?? lastContentElRef.current;
		if (onCloseComplete && el) {
			onCloseComplete(el);
		}
		lastContentElRef.current = null;
		onExitFinish?.();
	}, [onExitFinish, onCloseComplete]);

	const handleDialogEnterFinish = useCallback(() => {
		if (onOpenComplete && contentRef.current) {
			onOpenComplete(contentRef.current, true);
		}
	}, [onOpenComplete]);

	// Honor `shouldReturnFocus={ref}` on unmount.
	// Native <dialog>.close() restores focus to the trigger that opened it,
	// but the consumer asked for focus to go to a specific element instead.
	// Run this in an unmount cleanup so it fires after dialog.close()
	// (which fires in the Dialog's effect cleanup).
	const shouldReturnFocusRef = useRef(shouldReturnFocus);
	shouldReturnFocusRef.current = shouldReturnFocus;
	useEffect(() => {
		return () => {
			const target = shouldReturnFocusRef.current;
			if (typeof target === 'object' && target.current) {
				target.current.focus();
			}
		};
	}, []);

	// Focus a ref-targeted element after mount (when autoFocus is a ref).
	// When true, native <dialog>.showModal() handles focus automatically.
	useAutoFocus(
		typeof autoFocus === 'object' ? autoFocus : undefined,
		typeof autoFocus === 'object',
	);

	// Chrome cross-origin iframe DnD workaround (crbug.com/362301053)
	useEffect(() => {
		return combine(
			disableDraggingToCrossOriginIFramesForElement(),
			disableDraggingToCrossOriginIFramesForTextSelection(),
			disableDraggingToCrossOriginIFramesForExternal(),
		);
	}, []);

	const scrollMode = getScrollMode({ isFullScreen, shouldScrollInViewport });

	return (
		<Dialog
			ref={dialogRef}
			onClose={onDialogClose}
			dismissedBy={dismissedBy}
			onExitFinish={handleDialogExitFinish}
			shouldAnimate={!isFullScreen}
			isOpen={!isExiting}
			onEnterFinish={handleDialogEnterFinish}
			shouldHideBackdrop={isBlanketHidden}
			// Dialog requires at least one of `label` or `labelledBy` (string, not undefined).
			// Prefer the consumer-provided `label`; otherwise reference the internal `titleId`.
			{...(label ? { label } : { labelledBy: titleId })}
			testId={defaultTestId}
			xcss={dialogStyles[scrollMode]}
		>
			{/*
			 * Prevent background scroll (native inertness only blocks focus/click).
			 *
			 * `isOpen={true}` (rather than `!isExiting`) so the lock is held for the
			 * full visible lifetime of the modal. `DialogScrollLock` is rendered
			 * inside `<Dialog>`, which is conditionally mounted by
			 * `ExitingPersistence` — when the consumer closes the modal,
			 * `isExiting` flips to `true` and Dialog's exit animation plays for
			 * hundreds of milliseconds while the dialog is still visible. Tying
			 * the lock to `!isExiting` would release scroll lock at the start of
			 * that animation, allowing the background to scroll while the modal
			 * is still on screen. The lock is released naturally when
			 * `ExitingPersistence` unmounts this subtree after the exit settles.
			 */}
			<DialogScrollLock isOpen={true} />
			{/* Visual content container - Dialog handles the raw <dialog>. */}
			{/* No tabIndex: native <dialog>.showModal() picks the first focusable
			    descendant as initial focus target. A tabIndex on this wrapper
			    would steal that focus from the close button (or other intended
			    autofocus target). The <dialog> element itself receives the
			    focus ring when no descendants are focusable. */}
			<div
				ref={contentRef}
				css={[
					surfaceStyles.root,
					!isFullScreen && surfaceStyles.borderRadius,
					topLayerScrollModeStyles[scrollMode],
					// Unless the consumer is explicitly setting a height, we don't want to be taller than the content
					!height && !isFullScreen && topLayerAutoHeightStyles,
				]}
				style={
					{
						'--modal-dialog-height': getTopLayerSurfaceHeight(height),
						'--modal-dialog-width': getTopLayerSurfaceWidth(width),
					} as React.CSSProperties
				}
			>
				<ModalContext.Provider value={modalDialogContext}>
					<ScrollContext.Provider value={shouldScrollInViewport}>{children}</ScrollContext.Provider>
				</ModalContext.Provider>
			</div>
		</Dialog>
	);
}

/**
 * Legacy rendering path (Portal + FocusLock + ScrollLock + Blanket).
 *
 * Every hook here runs unconditionally: this component only mounts on the
 * legacy path, so it never shares a hook sequence with the top-layer path.
 */
const ModalWrapperLegacy = forwardRef(
	(props: InternalModalWrapperProps, ref: React.Ref<HTMLElement>) => {
		const {
			autoFocus,
			focusLockAllowlist,
			shouldCloseOnEscapePress = true,
			shouldCloseOnOverlayClick = true,
			shouldScrollInViewport = false,
			shouldReturnFocus = true,
			stackIndex: stackIndexOverride,
			onClose: providedOnClose,
			onStackChange = noop,
			isBlanketHidden,
			children,
			height,
			width,
			onCloseComplete,
			onOpenComplete,
			label,
			testId,
			isFullScreen,
			UNSAFE_shouldDisableMotionUplift = false,
		} = props;

		const calculatedStackIndex = useModalStack({ onStackChange });
		const stackIndex = stackIndexOverride || calculatedStackIndex;
		const isForeground = stackIndex === 0;

		// If no ref is provided, autofocus on first element
		const autoFocusLock = !(typeof autoFocus === 'object');

		const onCloseHandler = useModalCloseHandler(providedOnClose);

		const onBlanketClicked = useCallback(
			(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
				if (shouldCloseOnOverlayClick) {
					onCloseHandler(e);
				}
			},
			[shouldCloseOnOverlayClick, onCloseHandler],
		);

		// Stable callback to avoid re-renders when focusLockAllowlist is not provided.
		const allowListCallback = useCallback(
			(element: HTMLElement) => allowlistElements(element, focusLockAllowlist),
			[focusLockAllowlist],
		);

		// Prevent background scroll (top-layer path uses DialogScrollLock instead).
		usePreventProgrammaticScroll();

		// Register with the open layer observer. On the top-layer path the Dialog
		// primitive does this itself, which is why it lives in this legacy-only
		// component rather than the shared dispatcher.
		useNotifyOpenLayerObserver({
			type: 'modal',
			// Always open — modal is conditionally rendered when visible.
			isOpen: true,
			// No-op: no current use case for programmatic close via OpenLayerObserver.
			onClose: noop,
		});

		const modalDialogWithBlanket = (
			<Blanket
				isTinted={!isBlanketHidden}
				onBlanketClicked={onBlanketClicked}
				testId={testId && `${testId}--blanket`}
			>
				<ModalDialog
					testId={testId}
					label={label}
					autoFocus={autoFocus}
					stackIndex={stackIndex}
					onClose={onCloseHandler}
					shouldCloseOnEscapePress={shouldCloseOnEscapePress && isForeground}
					shouldScrollInViewport={shouldScrollInViewport}
					height={height}
					width={width}
					onCloseComplete={onCloseComplete}
					onOpenComplete={onOpenComplete}
					hasProvidedOnClose={Boolean(providedOnClose)}
					isFullScreen={isFullScreen}
					UNSAFE_shouldDisableMotionUplift={UNSAFE_shouldDisableMotionUplift}
					ref={ref}
				>
					{children}
				</ModalDialog>
			</Blanket>
		);

		let returnFocus = true;
		let onDeactivation: (node: HTMLElement) => void = noop;

		if ('boolean' === typeof shouldReturnFocus) {
			returnFocus = shouldReturnFocus;
		} else {
			onDeactivation = () => {
				window.setTimeout(() => {
					shouldReturnFocus.current?.focus();
				}, 0);
			};
		}

		return (
			<Layering isDisabled={false}>
				<Portal zIndex={layers.modal()}>
					{!UNSAFE_shouldDisableMotionUplift && fg('platform-dst-motion-uplift-modal') ? (
						<Motion
							enteringAnimation={token('motion.blanket.enter')}
							exitingAnimation={token('motion.blanket.exit')}
						>
							<div css={fillScreenStyles} aria-hidden={!isForeground}>
								<FocusLock
									autoFocus={autoFocusLock}
									returnFocus={returnFocus}
									onDeactivation={onDeactivation}
									whiteList={allowListCallback}
								>
									{/* Ensures scroll events are blocked on the document body and locked */}
									<ScrollLock />
									{/* TouchScrollable makes the whole modal dialog scrollable when scroll boundary is set to viewport. */}
									{shouldScrollInViewport ? (
										<TouchScrollable>{modalDialogWithBlanket}</TouchScrollable>
									) : (
										modalDialogWithBlanket
									)}
								</FocusLock>
							</div>
						</Motion>
					) : (
						<FadeIn>
							{(fadeInProps) => (
								<div
									{...fadeInProps}
									css={fillScreenStyles}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
									className={fadeInProps.className}
									aria-hidden={!isForeground}
								>
									<FocusLock
										autoFocus={autoFocusLock}
										returnFocus={returnFocus}
										onDeactivation={onDeactivation}
										whiteList={allowListCallback}
									>
										{/* Ensures scroll events are blocked on the document body and locked */}
										<ScrollLock />
										{/* TouchScrollable makes the whole modal dialog scrollable when scroll boundary is set to viewport. */}
										{shouldScrollInViewport ? (
											<TouchScrollable>{modalDialogWithBlanket}</TouchScrollable>
										) : (
											modalDialogWithBlanket
										)}
									</FocusLock>
								</div>
							)}
						</FadeIn>
					)}
				</Portal>
			</Layering>
		);
	},
);

// Choose the rendering implementation at the component boundary rather than
// gating hooks inside a single component. Each implementation owns its own
// hooks unconditionally, so a runtime feature-flag change swaps component types
// (a clean remount) instead of changing the hook order of a mounted component.
const InternalModalWrapper: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<InternalModalWrapperProps> & React.RefAttributes<HTMLElement>
> = forwardRef((props: InternalModalWrapperProps, ref: React.Ref<HTMLElement>) => {
	if (fg('platform-dst-top-layer')) {
		// TODO: the top-layer path does not forward the external `ref` (parity
		// with the pre-refactor behavior, where the top-layer branch never
		// consumed it). The public type still advertises `RefAttributes`, so a
		// consumer ref silently no-ops here. Follow up by forwarding `ref` to a
		// sensible element (for example the content `div`) once ref parity is
		// intentionally desired.
		return <ModalWrapperTopLayer {...props} />;
	}

	return <ModalWrapperLegacy ref={ref} {...props} />;
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default InternalModalWrapper;
