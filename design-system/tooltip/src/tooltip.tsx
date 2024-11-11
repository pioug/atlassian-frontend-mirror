import React, { useCallback, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { usePlatformLeafSyntheticEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import useCloseOnEscapePress from '@atlaskit/ds-lib/use-close-on-escape-press';
import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { type Direction, ExitingPersistence, FadeIn, type Transition } from '@atlaskit/motion';
import { mediumDurationMs } from '@atlaskit/motion/durations';
import { type Placement, Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import { register } from './internal/drag-manager';
import { type API, type Entry, show, type Source } from './internal/tooltip-manager';
import useUniqueId from './internal/use-unique-id';
import TooltipContainer from './tooltip-container';
import { type TooltipProps, type TriggerProps } from './types';
import { getMousePosition } from './utilities';

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
	| 'before-fade-out';

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
}: TooltipProps) {
	const tooltipPosition = position === 'mouse' ? mousePosition : position;
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

	const apiRef = useRef<API>(null);
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
	const stableProps = useStableRef({ onShowHandler, onHideHandler, delay, canAppear });
	const hasCalledShowHandler = useRef<boolean>(false);

	const start = useCallback((api: API) => {
		// @ts-ignore
		apiRef.current = api;
		hasCalledShowHandler.current = false;
	}, []);
	const done = useCallback(() => {
		if (!apiRef.current) {
			return;
		}
		// Only call onHideHandler if we have called onShowHandler
		if (hasCalledShowHandler.current) {
			stableProps.current.onHideHandler();
		}
		// @ts-ignore
		apiRef.current = null;
		// @ts-ignore
		hasCalledShowHandler.current = false;
		// just in case
		setState('hide');
	}, [stableProps]);

	const abort = useCallback(() => {
		if (!apiRef.current) {
			return;
		}
		apiRef.current.abort();
		// Only call onHideHandler if we have called onShowHandler
		if (hasCalledShowHandler.current) {
			stableProps.current.onHideHandler();
		}
		// @ts-ignore
		apiRef.current = null;
	}, [stableProps]);
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
			if (stableProps.current.canAppear && !stableProps.current.canAppear?.()) {
				return;
			}

			const entry: Entry = {
				source,
				delay: stableProps.current.delay,
				show: ({ isImmediate }) => {
					// Call the onShow handler if it hasn't been called yet
					if (!hasCalledShowHandler.current) {
						hasCalledShowHandler.current = true;
						stableProps.current.onShowHandler();
					}
					setState(isImmediate ? 'show-immediate' : 'fade-in');
				},
				hide: ({ isImmediate }) => {
					if (isImmediate) {
						setState('hide');
					} else {
						setState('before-fade-out');
					}
				},
				done,
			};

			const api: API = show(entry);
			start(api);
		},
		[stableProps, abort, done, start],
	);

	const hideTooltipOnEsc = useCallback(() => {
		apiRef.current?.requestHide({ isImmediate: true });
	}, [apiRef]);

	useCloseOnEscapePress({
		onClose: hideTooltipOnEsc,
		isDisabled: state === 'hide' || state === 'fade-out',
	});

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

			const source: Source =
				position === 'mouse'
					? {
							type: 'mouse',
							// TODO: ideally not recalculating this object each time
							mouse: getMousePosition({
								left: event.clientX,
								top: event.clientY,
							}),
						}
					: { type: 'keyboard' };

			tryShowTooltip(source);
		},
		[position, tryShowTooltip],
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

	const onMouseMove =
		position === 'mouse'
			? (event: React.MouseEvent<HTMLElement>) => {
					if (apiRef.current?.isActive()) {
						apiRef.current.mousePosition = getMousePosition({
							left: event.clientX,
							top: event.clientY,
						});
					}
				}
			: undefined;

	const onMouseOverTooltip = useCallback(() => {
		if (apiRef.current && apiRef.current.isActive()) {
			apiRef.current.keep();
			return;
		}
	}, []);

	const onFocus = useCallback(() => {
		// TODO: this does not play well with `hideTooltipOnMouseDown`
		// as "focus" will occur after the "mousedown".
		tryShowTooltip({ type: 'keyboard' });
	}, [tryShowTooltip]);

	const onBlur = useCallback(() => {
		if (apiRef.current) {
			apiRef.current.requestHide({ isImmediate: false });
		}
	}, []);

	const onAnimationFinished = useCallback(
		(transition: Transition) => {
			// Using lastState here because motion is not picking up the latest value
			if (transition === 'exiting' && stableState.current === 'fade-out' && apiRef.current) {
				// @ts-ignore: refs are writeable
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

	const shouldRenderTooltipChildren: boolean = state !== 'hide' && state !== 'fade-out';

	useNotifyOpenLayerObserver({ isOpen: shouldRenderTooltipPopup });

	const getReferenceElement = () => {
		if (position === 'mouse' && apiRef.current?.mousePosition) {
			return apiRef.current?.mousePosition;
		}

		return targetRef.current || undefined;
	};

	const tooltipIdForHiddenContent = useUniqueId('tooltip', shouldRenderHiddenContent);

	const tooltipTriggerProps: Omit<TriggerProps, 'ref'> = {
		onMouseOver,
		onMouseOut,
		onMouseMove,
		onMouseDown,
		onClick,
		onFocus,
		onBlur,
	};

	// Don't set `data-testid` unless it's defined, as it's not in the interface.
	if (testId) {
		// @ts-expect-error - Adding `data-testid` to the TriggerProps interface breaks Buttons.
		tooltipTriggerProps['data-testid'] = `${testId}--container`;
	}

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

	return (
		<>
			{typeof children === 'function' ? (
				// once we deprecate the wrapped approach, we can put the aria
				// attribute back into the tooltipTriggerProps and make it required
				// instead of optional in `types`
				<>
					{children({
						...tooltipTriggerProps,
						'aria-describedby': tooltipIdForHiddenContent,
						ref: setDirectRef,
					})}
					{/* render a hidden tooltip content for screen readers to announce */}
					{hiddenContent}
				</>
			) : (
				<CastTargetContainer
					{...tooltipTriggerProps}
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
					{/* render a hidden tooltip content for screen readers to announce */}
					{hiddenContent}
				</CastTargetContainer>
			)}

			{shouldRenderTooltipPopup ? (
				<Portal zIndex={tooltipZIndex}>
					<Popper
						placement={tooltipPosition}
						referenceElement={getReferenceElement() as HTMLElement}
						strategy={strategy}
					>
						{({ ref, style, update, placement }) => {
							// Invert the entrance and exit directions.
							// E.g. a tooltip's position is on the 'right', it should enter from and exit to the 'left'
							// This gives the effect the tooltip is appearing from the target
							const direction =
								position === 'mouse'
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
											duration={state === 'show-immediate' ? 0 : mediumDurationMs}
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
				</Portal>
			) : null}
		</>
	);
}

Tooltip.displayName = 'Tooltip';

export default Tooltip;
