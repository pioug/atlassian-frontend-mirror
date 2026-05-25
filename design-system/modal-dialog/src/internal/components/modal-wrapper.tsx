/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';

import { css, jsx } from '@compiled/react';
import FocusLock from 'react-focus-lock';
import ScrollLock, { TouchScrollable } from 'react-scrolllock';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import { cssMap } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { useId } from '@atlaskit/ds-lib/use-id';
import { Layering } from '@atlaskit/layering';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { Motion } from '@atlaskit/motion';
import { useExitingPersistence } from '@atlaskit/motion/exiting-persistence';
import FadeIn from '@atlaskit/motion/fade-in';
import { fg } from '@atlaskit/platform-feature-flags';
import Portal from '@atlaskit/portal';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { layers } from '@atlaskit/theme/constants';
import { type CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';
import { dialogSlideUpAndFade } from '@atlaskit/top-layer/animations';
import { createCloseEvent, type TDialogCloseReason } from '@atlaskit/top-layer/create-close-event';
import { Dialog } from '@atlaskit/top-layer/dialog';
import { DialogScrollLock } from '@atlaskit/top-layer/dialog-scroll-lock';

import type { KeyboardOrMouseEvent, ModalDialogProps } from '../../types';
import { ModalContext, ScrollContext } from '../context';
import useModalStack from '../hooks/use-modal-stack';
import usePreventProgrammaticScroll from '../hooks/use-prevent-programmatic-scroll';
import { disableDraggingToCrossOriginIFramesForElement } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/element';
import { disableDraggingToCrossOriginIFramesForExternal } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/external';
import { disableDraggingToCrossOriginIFramesForTextSelection } from '../pragmatic-drag-and-drop/disable-dragging-to-cross-origin-iframes/text-selection';
import type { InternalModalWrapperProps } from '../types';

import ModalDialog, { dialogHeight, dialogWidth as getDialogWidth } from './modal-dialog';

const modalAnimation = dialogSlideUpAndFade();

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

// Visual styles for modal content inside native <dialog>.
// Uses cssMap (not css) to avoid triggering no-nested-styles lint rule.

const LOCAL_CURRENT_SURFACE_CSS_VAR: typeof CURRENT_SURFACE_CSS_VAR =
	'--ds-elevation-surface-current';

const topLayerStyles = cssMap({
	content: {
		display: 'flex',
		// Fill viewport-height dialog on mobile.
		height: '100%',
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
		'@media (min-width: 30rem)': {
			borderRadius: token('radius.small', '3px'),
		},
	},
	// platform-dst-shape-theme-default TODO: Merge into base after rollout
	borderRadiusT26: {
		'@media (min-width: 30rem)': {
			borderRadius: token('radius.xlarge', '12px'),
		},
	},
});

// Scroll-mode styles for the content div.
// Height overrides use ID-scoped <style> (see dialogPositionStyles) because
// Compiled atomic classes have specificity (0,1,0) (increaseSpecificity is disabled).
// The doubled-ID selector (#id#id > div) at (2,0,1) reliably wins.
// Only non-height properties needing the && boost remain here.

const topLayerBodyScrollStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/design-system/no-nested-styles
		'&&': {
			// 120px = 60px top gutter + 60px bottom gutter
			maxHeight: 'calc(100vh - 120px + 1px)',
		},
	},
});

const topLayerViewportScrollStyles = css({
	// Fill viewport on mobile; allow overflow when content is taller.
	minHeight: '100vh',
	maxHeight: 'none',
});

const allowlistElements = (element: HTMLElement, callback?: (element: HTMLElement) => boolean) => {
	// Allow focus outside modal when AUI dialog is visible
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- legacy FocusLock allowlist
	if (Boolean(document.querySelector('.aui-blanket:not([hidden])'))) {
		return false;
	}
	// Optional callback to let consumers exclude elements from focus lock
	if (typeof callback === 'function') {
		return callback(element);
	}
	return true;
};

const InternalModalWrapper: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<InternalModalWrapperProps> & React.RefAttributes<HTMLElement>
> = forwardRef((props: InternalModalWrapperProps, ref: React.Ref<HTMLElement>) => {
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

	const onCloseHandler = usePlatformLeafEventHandler({
		fn: providedOnClose || noop,
		action: 'closed',
		componentName: 'modalDialog',
		packageName: process.env._PACKAGE_NAME_!,
		packageVersion: process.env._PACKAGE_VERSION_!,
	});

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

	// Called outside the feature-flag branch to keep hook order stable.
	// Legacy path: FadeIn calls onFinish. Top-layer path: called directly.
	const { isExiting, onFinish: onExitFinish } = useExitingPersistence();

	// Prevent background scroll (top-layer path uses DialogScrollLock instead).
	// Safe conditional hook: feature flags are resolved once at startup.
	if (!fg('platform-dst-top-layer')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		usePreventProgrammaticScroll();
	}

	// On the top-layer path, the Dialog primitive registers with the observer
	// directly, so we skip registration here to avoid double-counting.
	// Safe conditional hook: feature flags are resolved once at startup.
	if (!fg('platform-dst-top-layer')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useNotifyOpenLayerObserver({
			type: 'modal',
			// Always open — modal is conditionally rendered when visible.
			isOpen: true,
			// No-op: no current use case for programmatic close via OpenLayerObserver.
			onClose: noop,
		});
	}

	/**
	 * Top-layer path (platform-dst-top-layer).
	 *
	 * Replaces Portal, FocusLock, ScrollLock, Blanket, Positioner, and z-index
	 * management with native <dialog> via @atlaskit/top-layer/dialog.
	 *
	 * Key decisions:
	 * - Animation: CSS transitions via @starting-style / allow-discrete.
	 * - Close gating: onDialogClose only forwards allowed reasons
	 *   (see notes/guides/dialog-close-flow.md).
	 * - onClose event param: undefined - consumers should use close reason.
	 * - Focus restoration: native <dialog> behavior replaces react-focus-lock's
	 *   returnFocus (see accessibility-criteria.md).
	 */
	if (fg('platform-dst-top-layer')) {
		// Native <dialog> always restores focus on close - no opt-out via shouldReturnFocus.
		const defaultTestId = testId || 'modal-dialog';

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const id = useId();
		const titleId = `modal-dialog-title-${id}`;

		// Content container ref - used for onOpenComplete/onCloseComplete callbacks.
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const contentRef = useRef<HTMLDivElement>(null);

		// Cache last content element for onCloseComplete after children unmount
		// (with reduced motion, contentRef clears before onExitFinish fires).
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const lastContentElRef = useRef<HTMLDivElement | null>(null);
		if (contentRef.current) {
			lastContentElRef.current = contentRef.current;
		}

		// Native <dialog> ref - needed for ExitingPersistence to call dialog.close().
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const dialogRef = useRef<HTMLDialogElement | null>(null);

		// eslint-disable-next-line react-hooks/rules-of-hooks
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

		// Only forward close when the reason is allowed by props.
		// Passes a synthetic event to satisfy the KeyboardOrMouseEvent contract.
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const onDialogClose = useCallback(
			({ reason }: { reason: TDialogCloseReason }) => {
				if (reason === 'escape' && shouldCloseOnEscapePress) {
					onCloseHandler(createCloseEvent({ reason }) as unknown as KeyboardOrMouseEvent);
				}
				if (reason === 'overlay-click' && shouldCloseOnOverlayClick) {
					onCloseHandler(createCloseEvent({ reason }) as unknown as KeyboardOrMouseEvent);
				}
			},
			[onCloseHandler, shouldCloseOnEscapePress, shouldCloseOnOverlayClick],
		);

		// ExitingPersistence: isExiting → isOpen={false} → Dialog exit animation →
		// onExitFinish → onCloseComplete + unmount.
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const handleDialogExitFinish = useCallback(() => {
			const el = contentRef.current ?? lastContentElRef.current;
			if (onCloseComplete && el) {
				onCloseComplete(el);
			}
			lastContentElRef.current = null;
			onExitFinish?.();
		}, [onExitFinish, onCloseComplete]);

		// Fire onOpenComplete after mount.
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (onOpenComplete && contentRef.current) {
				onOpenComplete(contentRef.current, true);
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		// Honor `shouldReturnFocus={ref}` on unmount.
		// Native <dialog>.close() restores focus to the trigger that opened it,
		// but the consumer asked for focus to go to a specific element instead.
		// Run this in an unmount cleanup so it fires after dialog.close()
		// (which fires in the Dialog's effect cleanup).
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const shouldReturnFocusRef = useRef(shouldReturnFocus);
		shouldReturnFocusRef.current = shouldReturnFocus;
		// eslint-disable-next-line react-hooks/rules-of-hooks
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
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useAutoFocus(
			typeof autoFocus === 'object' ? autoFocus : undefined,
			typeof autoFocus === 'object',
		);

		// Chrome cross-origin iframe DnD workaround (crbug.com/362301053)
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			return combine(
				disableDraggingToCrossOriginIFramesForElement(),
				disableDraggingToCrossOriginIFramesForTextSelection(),
				disableDraggingToCrossOriginIFramesForExternal(),
			);
		}, []);

		// Responsive layout via ID-scoped <style> (same pattern as Dialog's hideBackdrop).
		// ID selector beats Compiled atomic classes without !important and supports @media.
		const namedWidth = getDialogWidth(width ?? 'medium');
		const dialogId = `modal-dialog-${id}`;
		const escapedDialogId = CSS.escape(dialogId);

		// Percentage widths need special handling in the top layer.
		// In legacy, the percentage resolved against the Positioner's max-width
		// (100vw - 120px). In the top layer, the <dialog>'s containing block is the
		// viewport (100vw), so a raw percentage would produce a wider modal.
		// Transform e.g. '42%' → 'calc(42 * (100vw - 120px) / 100)' to match legacy.
		const resolvedWidth = namedWidth.endsWith('%')
			? `calc(${parseFloat(namedWidth)} * (100vw - 120px) / 100)`
			: namedWidth;

		const dialogStyle: Record<string, string> = isFullScreen
			? {
					width: '100vw',
					height: '100vh',
					margin: '0',
				}
			: {
					width: `min(${resolvedWidth}, 100vw)`,
				};

		// Shift stacked background modals down by space.100 (8px) per level.
		if (stackIndex > 0) {
			dialogStyle['transform'] = `translateY(calc(${stackIndex}px * ${token('space.100')}))`;
		}

		// Mobile: viewport fill. Desktop (≥ 30rem): gutter margins, auto height.
		// Content-div height set via #id > div to beat Compiled's atomic specificity.
		const desktopMargin = shouldScrollInViewport ? '60px auto' : '60px auto auto';
		const resolvedHeight = dialogHeight(height);
		// Body-scroll: specified height or auto. Viewport-scroll: uses min-height.
		const desktopContentHeight = shouldScrollInViewport ? 'auto' : resolvedHeight;
		const desktopContentMinHeight = shouldScrollInViewport ? resolvedHeight : 'auto';
		// Viewport-scroll: the legacy Positioner was a fixed 100vh container that
		// scrolled internally, so the modal section could fill (100vh - 60px top gutter).
		// In the top layer the <dialog> sizes to content with height:auto, so we need
		// an explicit min-height to ensure the dialog stretches to the same visible area.
		const desktopDialogMinHeight = shouldScrollInViewport ? 'min-height:calc(100vh - 60px);' : '';
		// Doubled-ID selector (#id#id > div) at specificity (2,0,1) beats
		// Compiled atomic classes at (0,1,0) (increaseSpecificity is disabled).
		const dialogPositionStyles = isFullScreen
			? ''
			: // Mobile: edge-to-edge. Desktop (≥ 30rem): 60px gutters, max-width.
				`#${escapedDialogId}#${escapedDialogId}{margin:0;height:100vh}#${escapedDialogId}#${escapedDialogId}>div{height:100%}@media(min-width:30rem){#${escapedDialogId}#${escapedDialogId}{margin:${desktopMargin};height:auto;${desktopDialogMinHeight}max-width:calc(100vw - 120px)}#${escapedDialogId}#${escapedDialogId}>div{height:${desktopContentHeight};min-height:${desktopContentMinHeight}}}`;

		return (
			<Dialog
				ref={dialogRef}
				id={dialogId}
				onClose={onDialogClose}
				onExitFinish={handleDialogExitFinish}
				animate={isFullScreen ? false : modalAnimation}
				isOpen={!isExiting}
				shouldHideBackdrop={stackIndex > 0 || Boolean(isBlanketHidden)}
				// Dialog requires at least one of `label` or `labelledBy` (string, not undefined).
				// Prefer the consumer-provided `label`; otherwise reference the internal `titleId`.
				{...(label ? { label } : { labelledBy: titleId })}
				testId={defaultTestId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={dialogStyle as CSSProperties}
			>
				{/* Prevent background scroll (native inertness only blocks focus/click). */}
				<DialogScrollLock />
				{/* ID-scoped responsive positioning (overrides atomic margin: auto). */}
				{dialogPositionStyles && (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
					<style>{dialogPositionStyles}</style>
				)}
				{/* Visual content container - Dialog handles the raw <dialog>. */}
				{/* No tabIndex: native <dialog>.showModal() picks the first focusable
				    descendant as initial focus target. A tabIndex on this wrapper
				    would steal that focus from the close button (or other intended
				    autofocus target). The <dialog> element itself receives the
				    focus ring when no descendants are focusable. */}
				<div
					ref={contentRef}
					css={[
						topLayerStyles.content,
						!isFullScreen && topLayerStyles.borderRadius,
						!isFullScreen &&
							fg('platform-dst-shape-theme-default') &&
							topLayerStyles.borderRadiusT26,
						!isFullScreen && !shouldScrollInViewport && topLayerBodyScrollStyles,
						!isFullScreen && shouldScrollInViewport && topLayerViewportScrollStyles,
					]}
				>
					<ModalContext.Provider value={modalDialogContext}>
						<ScrollContext.Provider value={shouldScrollInViewport}>
							{children}
						</ScrollContext.Provider>
					</ModalContext.Provider>
				</div>
			</Dialog>
		);
	}

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
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default InternalModalWrapper;
