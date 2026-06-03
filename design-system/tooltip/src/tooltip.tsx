import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import type { VirtualElement } from '@popperjs/core';
import { bind } from 'bind-event-listener';

import { usePlatformLeafSyntheticEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import useCloseOnEscapePress from '@atlaskit/ds-lib/use-close-on-escape-press';
import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { type Direction, ExitingPersistence, FadeIn, type Transition } from '@atlaskit/motion';
import { fg } from '@atlaskit/platform-feature-flags';
import { type Placement, Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';
import { fade, slideAndFade } from '@atlaskit/top-layer/animations';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useAnchorPositionAtPoint } from '@atlaskit/top-layer/use-anchor-position-at-point';

import { register } from './internal/drag-manager';
import { getAnchorPoint } from './internal/get-anchor-point';
import { getVirtualElementFromMousePos } from './internal/get-virtual-element-from-mouse-pos';
import { type API, type Entry, show, type Source } from './internal/tooltip-manager';
import useUniqueId from './internal/use-unique-id';
import TooltipContainer from './tooltip-container';
import { type PositionType } from './types';
import { type TooltipProps, type TriggerProps } from './types';

const tooltipZIndex = layers.tooltip();
const analyticsAttributes = {
	componentName: 'tooltip',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

// Inverts motion direction
const invertedDirection = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
} as const;

/**
 * Converts a Popper placement to it's general direction.
 *
 * @param placement - Popper Placement value, e.g. 'top-start'
 * @returns Popper Direction, e.g. 'top'
 */
const getDirectionFromPlacement = (placement: Placement): Direction =>
	placement.split('-')[0] as Direction;

type State =
	| 'hide'
	| 'show-immediate'
	| 'fade-in'
	| 'fade-out'
	// This occurs immediately before 'fade-out' so the ExitPersistence can render FadeIn
	// with the updated duration before removal. This ensures 'show-immediate' durations of 0
	// do not affect normal exit transitions.
	| 'before-fade-out'
	// Top-layer exit: keeps the popover mounted in the DOM while the CSS exit
	// transition plays. Same pattern as modal-dialog's ExitingPersistence glue.
	// See top-layer/notes/guides/entry-exit-animations.md.
	| 'top-layer-exit';

/**
 * __Tooltip__
 *
 * A tooltip is a floating, non-actionable label used to explain a user interface element or feature.
 */
function Tooltip({
	children,
	position = 'bottom',
	mousePosition = 'bottom',
	content,
	truncate = false,
	// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
	component: Container = TooltipContainer,
	tag: TargetContainer = 'div',
	testId,
	delay = 300,
	onShow = noop,
	onHide = noop,
	canAppear,
	hideTooltipOnClick = false,
	hideTooltipOnMouseDown = false,
	analyticsContext,
	strategy = 'fixed',
	ignoreTooltipPointerEvents = false,
	isScreenReaderAnnouncementDisabled = false,
	shortcut,
	shouldAlwaysFadeIn = false,
	shouldRenderToParent = false,
}: TooltipProps): React.JSX.Element {
	// Not using a gate for this check. When the gate is disabled `mouse-y` and `mouse-x` are treated as `mouse`.
	const isMousePosition = position === 'mouse' || position === 'mouse-y' || position === 'mouse-x';

	const tooltipPosition = isMousePosition ? mousePosition : position;
	const onShowHandler = usePlatformLeafSyntheticEventHandler({
		fn: onShow,
		action: 'displayed',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});
	const onHideHandler = usePlatformLeafSyntheticEventHandler({
		fn: onHide,
		action: 'hidden',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const apiRef = useRef<API | null>(null);
	const [state, setState] = useState<State>('hide');
	const targetRef = useRef<HTMLElement | null>(null);
	const containerRef = useRef<HTMLElement | null>(null);

	// This function is deliberately _not_ memoized as it needs to re-run every render
	// to pick up any child ref changes. If you use render props you don't have this issue.
	const setImplicitRefFromChildren = (node: HTMLElement | null) => {
		containerRef.current = node;
		targetRef.current = node ? (node.firstElementChild as HTMLElement | null) : null;
	};

	// This is memoized and passed into the render props callback.
	const setDirectRef = useCallback((node: HTMLElement | null) => {
		targetRef.current = node;
	}, []);

	// Putting a few things into refs so that we don't have to break memoization
	const stableState = useStableRef(state);
	// These props are placed in separate refs instead of a single object to reduce memory usage.
	// Placing them in the same object previously caused an increase in the number of JavaScript event listeners
	// before garbage collection.
	const onShowHandlerStable = useStableRef(onShowHandler);
	const onHideHandlerStable = useStableRef(onHideHandler);
	const delayStable = useStableRef(delay);
	const canAppearStable = useStableRef(canAppear);
	const hasCalledShowHandler = useRef<boolean>(false);
	const shouldAlwaysFadeInStable = useStableRef(shouldAlwaysFadeIn);

	const start = useCallback((api: API) => {
		apiRef.current = api;
		hasCalledShowHandler.current = false;
	}, []);
	const done = useCallback(() => {
		if (!apiRef.current) {
			return;
		}
		// Only call onHideHandler if we have called onShowHandler
		if (hasCalledShowHandler.current) {
			onHideHandlerStable.current();
		}

		apiRef.current = null;
		hasCalledShowHandler.current = false;
		// just in case
		setState('hide');
	}, [onHideHandlerStable]);

	const abort = useCallback(() => {
		if (!apiRef.current) {
			return;
		}
		apiRef.current.abort();
		// Only call onHideHandler if we have called onShowHandler
		if (hasCalledShowHandler.current) {
			onHideHandlerStable.current();
		}
		apiRef.current = null;
	}, [onHideHandlerStable]);
	useEffect(
		function mount() {
			return function unmount() {
				if (apiRef.current) {
					abort();
				}
			};
		},
		[abort],
	);

	const isDraggingRef = useRef(false);

	useEffect(() => {
		return register({
			onRegister({ isDragging }) {
				isDraggingRef.current = isDragging;
			},
			onDragStart() {
				/**
				 * Hiding any visible tooltips when a drag starts because otherwise it
				 * looks janky (disappears and reappears), and is not required.
				 */
				apiRef.current?.requestHide({ isImmediate: true });
				isDraggingRef.current = true;
			},
			onDragEnd() {
				isDraggingRef.current = false;
			},
		});
	}, []);

	const tryShowTooltip = useCallback(
		(source: Source) => {
			/**
			 * Prevent tooltips from being shown during a drag. This can occur with
			 * the native drag and drop API, where some pointer events can fire
			 * when they should not and lead to jank with tooltips.
			 */
			if (isDraggingRef.current) {
				return;
			}

			// Another tooltip is has been active but we still have the old `api`
			// around. We need to finish up the last usage.
			// Note: just being safe - this should not happen
			if (apiRef.current && !apiRef.current.isActive()) {
				abort();
			}

			// This tooltip is already active, we can exit
			if (apiRef.current && apiRef.current.isActive()) {
				apiRef.current.keep();
				return;
			}

			/**
			 * Check if tooltip is allowed to show.
			 *
			 * Once a tooltip has started, or has scheduled to start
			 * we won't be checking `canAppear` again.
			 *
			 * - We don't want tooltips to disappear once they are shown
			 * - For consistency, we start after a single positive `canAppear`.
			 *   Otherwise the amount of times we ask consumers would depend on
			 *   how many times we get a "mousemove", which _could_ lead to situations
			 *   where moving the mouse could result in a different outcome to if
			 *   the mouse was not moved.
			 */
			if (canAppearStable.current && !canAppearStable.current?.()) {
				return;
			}

			const entry: Entry = {
				source,
				delay: delayStable.current,
				show: ({ isImmediate }) => {
					// Call the onShow handler if it hasn't been called yet
					if (!hasCalledShowHandler.current) {
						hasCalledShowHandler.current = true;
						onShowHandlerStable.current();
					}
					setState(!isImmediate ? 'fade-in' : 'show-immediate');
				},
				hide: ({ isImmediate }) => {
					if (isImmediate) {
						setState('hide');
					} else if (fg('platform-dst-top-layer')) {
						// Top-layer path: set state to 'top-layer-exit'. The component
						// stays mounted and Popover's isOpen prop transitions to
						// false, triggering the CSS exit animation internally.
						// finishHideAnimation is called after a brief delay matching
						// the CSS exit animation duration.
						setState('top-layer-exit');
					} else {
						setState('before-fade-out');
					}
				},
				done,
				shouldAlwaysFadeIn: shouldAlwaysFadeInStable.current,
			};

			const api: API = show(entry);
			start(api);
		},
		[
			canAppearStable,
			delayStable,
			done,
			start,
			abort,
			onShowHandlerStable,
			shouldAlwaysFadeInStable,
		],
	);

	const hideTooltipOnEsc = useCallback(() => {
		apiRef.current?.requestHide({ isImmediate: true });
	}, [apiRef]);

	// When using top-layer, popover="auto" handles Escape natively
	useCloseOnEscapePress({
		onClose: hideTooltipOnEsc,
		isDisabled:
			state === 'hide' ||
			state === 'fade-out' ||
			state === 'top-layer-exit' ||
			fg('platform-dst-top-layer'),
	});

	// ── Top-layer exit animation lifecycle ──
	// When state is 'top-layer-exit', Popover's isOpen transitions to false and
	// the CSS exit animation plays. The Popover's built-in `transitionend`
	// detection (with timeout fallback) calls `onExitFinish` when the exit
	// animation completes, which triggers the tooltip-manager lifecycle
	// (finishHideAnimation → done → onHide, setState('hide'), cleanup).
	const handleExitFinish = useCallback(() => {
		apiRef.current?.finishHideAnimation();
	}, []);

	useEffect(() => {
		if (state === 'hide') {
			return noop;
		}

		if (state === 'before-fade-out') {
			setState('fade-out');
		}

		const unbind = bind(window, {
			type: 'scroll',
			listener: () => {
				if (apiRef.current) {
					apiRef.current.requestHide({ isImmediate: true });
				}
			},
			options: { capture: true, passive: true, once: true },
		});

		return unbind;
	}, [state]);

	const onMouseDown = useCallback(() => {
		if (hideTooltipOnMouseDown && apiRef.current) {
			apiRef.current.requestHide({ isImmediate: true });
		}
	}, [hideTooltipOnMouseDown]);

	const onClick = useCallback(() => {
		if (hideTooltipOnClick && apiRef.current) {
			apiRef.current.requestHide({ isImmediate: true });
		}
	}, [hideTooltipOnClick]);

	// Ideally we would be using onMouseEnter here, but
	// because we are binding the event to the target parent
	// we need to listen for the mouseover of all sub elements
	// This means when moving along a tooltip we are quickly toggling
	// between api.requestHide and api.keep. This it not ideal
	const onMouseOver = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			// Ignoring events from the container ref
			if (containerRef.current && event.target === containerRef.current) {
				return;
			}

			// Using prevent default as a signal that parent tooltips
			if (event.defaultPrevented) {
				return;
			}
			event.preventDefault();

			const source: Source = isMousePosition
				? {
						type: 'mouse',
						clientX: event.clientX,
						clientY: event.clientY,
					}
				: { type: 'keyboard' };

			tryShowTooltip(source);
		},
		[isMousePosition, tryShowTooltip],
	);

	// Ideally we would be using onMouseEnter here, but
	// because we are binding the event to the target parent
	// we need to listen for the mouseout of all sub elements
	// This means when moving along a tooltip we are quickly toggling
	// between api.requestHide and api.keep. This it not ideal
	const onMouseOut = useCallback((event: React.MouseEvent<HTMLElement>) => {
		// Ignoring events from the container ref
		if (containerRef.current && event.target === containerRef.current) {
			return;
		}

		// Using prevent default as a signal that parent tooltips
		if (event.defaultPrevented) {
			return;
		}
		event.preventDefault();

		if (apiRef.current) {
			apiRef.current.requestHide({
				isImmediate: false,
			});
		}
	}, []);

	const onMouseMove = isMousePosition
		? (event: React.MouseEvent<HTMLElement>) => {
				if (apiRef.current?.isActive()) {
					apiRef.current.mousePos = { clientX: event.clientX, clientY: event.clientY };
				}
			}
		: undefined;

	const onMouseOverTooltip = useCallback(() => {
		if (apiRef.current && apiRef.current.isActive()) {
			apiRef.current.keep();
			return;
		}
	}, []);

	const onFocus = useCallback(
		(e: React.FocusEvent<HTMLElement>) => {
			// Check if focus-visible
			// Prevents tooltips from showing when focus is not visible,
			// i.e., when focus is moved onto tooltip trigger inside a popup on open
			try {
				if (!e.target.matches(':focus-visible')) {
					return;
				}
			} catch {
				// Ignore errors from environments that don't support :focus-visible
			}

			// TODO: this does not play well with `hideTooltipOnMouseDown`
			// as "focus" will occur after the "mousedown".
			tryShowTooltip({ type: 'keyboard' });
		},
		[tryShowTooltip],
	);

	const onBlur = useCallback(() => {
		if (apiRef.current) {
			apiRef.current.requestHide({ isImmediate: false });
		}
	}, []);

	const onAnimationFinished = useCallback(
		(transition: Transition) => {
			// Using lastState here because motion is not picking up the latest value
			if (transition === 'exiting' && stableState.current === 'fade-out' && apiRef.current) {
				apiRef.current.finishHideAnimation();
			}
		},
		[stableState],
	);

	// Doing a cast because typescript is struggling to narrow the type
	const CastTargetContainer = TargetContainer as React.ElementType;

	const shouldRenderTooltipPopup: boolean = state !== 'hide' && Boolean(content);
	const shouldRenderHiddenContent: boolean =
		!isScreenReaderAnnouncementDisabled && shouldRenderTooltipPopup;

	const shouldRenderTooltipChildren: boolean =
		state !== 'hide' && state !== 'fade-out' && state !== 'top-layer-exit';

	const handleOpenLayerObserverCloseSignal = useCallback(() => {
		apiRef.current?.requestHide({ isImmediate: true });
	}, []);

	// On the top-layer path, the Popover primitive (used by TopLayerTooltipPopup)
	// registers with the observer directly, so we skip registration here to
	// avoid double-counting.
	// Safe conditional hook: feature flags are resolved once at startup.
	if (!fg('platform-dst-top-layer')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useNotifyOpenLayerObserver({
			// Layer is only visually open if both the tooltip popup (container) and children are rendered.
			isOpen: shouldRenderTooltipPopup && shouldRenderTooltipChildren,
			/**
			 * We don't strictly need to provide an onClose callback at this time, as there is
			 * already code that handles hiding the tooltip when a drag is started (and the only
			 * usage right now is closing all layers when the user resizes the side nav).
			 *
			 * However, for future-proofing and semantic reasons, it makes sense to close the tooltip
			 * whenever the open layer observer requests a close.
			 */
			onClose: handleOpenLayerObserverCloseSignal,
		});
	}

	const getReferenceElement = (): HTMLElement | VirtualElement | undefined => {
		if (isMousePosition && apiRef.current?.mousePos && targetRef.current) {
			return getVirtualElementFromMousePos(apiRef.current.mousePos, {
				targetElement: targetRef.current,
				tooltipPosition: position,
			});
		}

		return targetRef.current || undefined;
	};

	const tooltipIdForHiddenContent = useUniqueId('tooltip', shouldRenderHiddenContent);

	const tooltipTriggerProps: Omit<TriggerProps, 'ref' | 'aria-describedby' | 'testId'> = {
		onMouseOver,
		onMouseOut,
		onMouseMove,
		onMouseDown,
		onClick,
		onFocus,
		onBlur,
	};

	// This useEffect is purely for managing the aria attribute when using the
	// wrapped children approach.
	const isChildrenAFunction: boolean = typeof children === 'function';
	useEffect(() => {
		if (isChildrenAFunction) {
			return;
		}

		// If `children` is _not_ a function, we are stepping outside of the public
		// API to add a `aria-describedby` attribute.

		const target = targetRef.current;

		if (!target || !tooltipIdForHiddenContent) {
			return;
		}

		target.setAttribute('aria-describedby', tooltipIdForHiddenContent);
		return () => target.removeAttribute('aria-describedby');
	}, [isChildrenAFunction, tooltipIdForHiddenContent]);

	const hiddenContent = shouldRenderHiddenContent ? (
		<span
			data-testid={testId ? `${testId}-hidden` : undefined}
			hidden
			id={tooltipIdForHiddenContent}
		>
			{typeof content === 'function' ? content({}) : content}
		</span>
	) : null;

	const PopperWrapper = shouldRenderToParent ? Fragment : TooltipPortal;

	const trigger =
		typeof children === 'function' ? (
			// once we deprecate the wrapped approach, we can put the aria
			// attribute back into the tooltipTriggerProps and make it required
			// instead of optional in `types`
			<>
				{children({
					...tooltipTriggerProps,
					// `testId` propagates to the trigger element so `data-testid` lands in the
					// rendered DOM. Required because `@atlaskit/button/new` (and other Pressable-
					// backed primitives) overwrite `data-testid` from spread; passing a typed
					// `testId` lets their own destructure pick it up directly.
					...(testId ? { testId: `${testId}--container` } : {}),
					'aria-describedby': tooltipIdForHiddenContent,
					ref: setDirectRef,
				})}
				{hiddenContent}
			</>
		) : (
			// @ts-ignore
			<CastTargetContainer
				{...tooltipTriggerProps}
				{...(testId ? { 'data-testid': `${testId}--container` } : undefined)}
				ref={setImplicitRefFromChildren}
				/**
				 * TODO: Why is role="presentation" added?
				 * - Is it only to "remove" the `Container` from screen readers?
				 * - Why is it added only to the `Container` but not to `tooltipTriggerProps`?
				 * - Should `role="presentation"` only be used if `shouldRenderHiddenContent == false`?
				 */
				role="presentation"
			>
				{children}
				{hiddenContent}
			</CastTargetContainer>
		);

	if (fg('platform-dst-top-layer')) {
		return (
			<>
				{trigger}
				{shouldRenderTooltipPopup ? (
					<TopLayerTooltipPopup
						targetRef={targetRef}
						tooltipPosition={tooltipPosition}
						mousePos={apiRef.current?.mousePos ?? undefined}
						position={position}
						onMouseOut={onMouseOut}
						onMouseOverTooltip={onMouseOverTooltip}
						ignoreTooltipPointerEvents={ignoreTooltipPointerEvents}
						truncate={truncate}
						testId={testId}
						shortcut={shortcut}
						content={content}
						Container={Container}
						onClose={() => apiRef.current?.requestHide({ isImmediate: true })}
						onExitFinish={handleExitFinish}
						isOpen={state !== 'hide' && state !== 'top-layer-exit'}
					/>
				) : null}
			</>
		);
	}

	return (
		<>
			{trigger}
			{shouldRenderTooltipPopup ? (
				<PopperWrapper>
					<Popper
						placement={tooltipPosition}
						referenceElement={getReferenceElement() as HTMLElement}
						strategy={strategy}
					>
						{({ ref, style, update, placement }) => {
							const direction = isMousePosition
								? undefined
								: invertedDirection[getDirectionFromPlacement(placement)];

							return (
								<ExitingPersistence appear>
									{shouldRenderTooltipChildren && (
										<FadeIn
											distance="constant"
											entranceDirection={direction}
											exitDirection={direction}
											onFinish={onAnimationFinished}
											duration={state !== 'show-immediate' ? 'medium' : 'none'}
										>
											{({ className }) => (
												<Container
													ref={ref}
													/**
													 * "Tooltip" classname is a hook used by tests to manipulate
													 * and hide tooltips, including in VR snapshots
													 */
													// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
													className={`Tooltip ${className}`}
													style={{
														// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
														...style,
														// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
														...(ignoreTooltipPointerEvents && {
															pointerEvents: 'none',
														}),
													}}
													truncate={truncate}
													placement={tooltipPosition}
													testId={
														getReferenceElement() ? testId : testId && `${testId}--unresolved`
													}
													onMouseOut={onMouseOut}
													onMouseOver={onMouseOverTooltip}
													shortcut={shortcut}
												>
													{typeof content === 'function' ? content({ update }) : content}
												</Container>
											)}
										</FadeIn>
									)}
								</ExitingPersistence>
							);
						}}
					</Popper>
				</PopperWrapper>
			) : null}
		</>
	);
}

export default Tooltip;

const TooltipPortal = ({ children }: { children: React.ReactNode }) => {
	return <Portal zIndex={tooltipZIndex}>{children}</Portal>;
};

// Module-level preset instance, stable reference, no re-allocation per render.
// Non-mouse tooltips slide in from the direction of the trigger — slide + fade.
const tooltipAnimation = slideAndFade();
// Mouse-position tooltips follow the cursor and have no fixed direction — fade only.
const tooltipMouseAnimation = fade();

/**
 * Top-layer tooltip popup component.
 *
 * Composes `Popover` (top-layer visibility + animation) with one of two
 * positioning hooks:
 *
 *   - `useAnchorPositionAtPoint` — for cursor-tracking positions
 *     (`mouse`, `mouse-x`, `mouse-y`) when a cursor position is
 *     available (i.e. the popup was activated by a pointer). Positions
 *     the popover relative to a hidden synthetic anchor that follows
 *     the cursor according to the `position` / `mousePosition`
 *     semantics. The synthetic anchor element is rendered as a sibling
 *     of the popover.
 *   - `useAnchorPosition` directly — for non-cursor positions, AND
 *     for cursor positions activated via keyboard focus (where there
 *     is no cursor to track). Anchoring directly to the trigger keeps
 *     keyboard-activated tooltips correctly placed next to the target
 *     instead of rendering in the top-left of the viewport.
 *
 * Exactly one positioning strategy is active at a time: `useAnchorPosition`
 * is wired to the trigger only when the mouse strategy is inactive, and
 * `useAnchorPositionAtPoint` is told `isActive: false` when the direct
 * anchor strategy is active. The other hook is still called (Rules of
 * Hooks) but does no work.
 *
 * Exit animation is handled by `Popover`'s `isOpen` prop. When `isOpen`
 * transitions to `false`, the primitive calls `hidePopover()` internally and
 * the CSS exit animation plays via `allow-discrete`. No glue code needed.
 */
function TopLayerTooltipPopup({
	targetRef,
	tooltipPosition,
	mousePos,
	position,
	onMouseOut,
	onMouseOverTooltip,
	ignoreTooltipPointerEvents,
	truncate,
	testId,
	shortcut,
	content,
	Container,
	onClose,
	onExitFinish,
	isOpen,
}: {
	targetRef: React.RefObject<HTMLElement | null>;
	tooltipPosition: Placement;
	mousePos: { clientX: number; clientY: number } | undefined;
	position: PositionType;
	onMouseOut: React.MouseEventHandler;
	onMouseOverTooltip: React.MouseEventHandler;
	ignoreTooltipPointerEvents: boolean;
	truncate: boolean;
	testId?: string;
	shortcut?: React.ReactNode;
	content: React.ReactNode | ((args: { update: () => void }) => React.ReactNode);
	Container: React.ElementType;
	onClose: () => void;
	onExitFinish?: () => void;
	isOpen: boolean;
}) {
	const popoverRef = useRef<HTMLDivElement>(null);

	// Translate the legacy Popper-style placement string ("right",
	// "bottom-start", etc.) once and pass the same object to both hooks.
	const placement = fromLegacyPlacement({ legacy: tooltipPosition });

	const isMousePosition = position === 'mouse' || position === 'mouse-x' || position === 'mouse-y';
	const isMouseStrategyActive = isMousePosition && Boolean(mousePos);

	// Direct anchor strategy: anchors to the trigger element.
	// Disabled when the mouse strategy is active — both hooks writing
	// to the same popover would fight for positioning ownership.
	useAnchorPosition({
		anchorRef: targetRef,
		popoverRef,
		placement,
		isEnabled: !isMouseStrategyActive,
	});

	// Mouse anchor strategy: the hook calls `getPoint()` exactly once
	// per activation and latches the resulting coordinate. The latch is
	// per-show because `TopLayerTooltipPopup` mounts fresh on every
	// show.
	//
	// `getPoint()` returns `null` for keyboard-activated shows (where
	// `mousePos` is undefined) or before the trigger has mounted —
	// leaving the direct strategy above to own positioning.
	//
	// SSR note: `getBoundingClientRect()` is only called here because
	// `TopLayerTooltipPopup` is gated behind client-only state
	// transitions.
	useAnchorPositionAtPoint({
		popoverRef,
		placement,
		isEnabled: isMouseStrategyActive,
		getPoint: () => {
			if (!mousePos || !targetRef.current || !isMousePosition) {
				return null;
			}

			return getAnchorPoint({
				cursor: mousePos,
				triggerRect: targetRef.current.getBoundingClientRect(),
				tooltipPosition: position,
				placement,
			});
		},
	});

	return (
		<Popover
			ref={popoverRef}
			role="tooltip"
			mode="hint"
			isOpen={isOpen}
			onClose={onClose}
			onExitFinish={onExitFinish}
			testId={testId ? `${testId}--popover` : undefined}
			// Override directional slide: mouse positions should fade only
			animate={isMouseStrategyActive ? tooltipMouseAnimation : tooltipAnimation}
			placement={placement}
		>
			{/* Popover already has role="tooltip", so the inner container uses "presentation" to avoid duplicate roles */}
			<Container
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- top-layer spike
				className="Tooltip"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- top-layer spike
				style={ignoreTooltipPointerEvents ? { pointerEvents: 'none' as const } : undefined}
				truncate={truncate}
				placement={tooltipPosition}
				testId={testId}
				onMouseOut={onMouseOut}
				onMouseOver={onMouseOverTooltip}
				shortcut={shortcut}
				role="presentation"
			>
				{typeof content === 'function' ? content({ update: noop }) : content}
			</Container>
		</Popover>
	);
}
