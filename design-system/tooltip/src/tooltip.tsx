import React, { useCallback, useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { usePlatformLeafSyntheticEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import useCloseOnEscapePress from '@atlaskit/ds-lib/use-close-on-escape-press';
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
	hideTooltipOnClick = false,
	hideTooltipOnMouseDown = false,
	analyticsContext,
	strategy = 'fixed',
	ignoreTooltipPointerEvents = false,
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
	const lastState = useRef<State>(state);
	const lastDelay = useRef<number>(delay);
	const lastHandlers = useRef({ onShowHandler, onHideHandler });
	const hasCalledShowHandler = useRef<boolean>(false);
	useEffect(() => {
		lastState.current = state;
		lastDelay.current = delay;
		lastHandlers.current = { onShowHandler, onHideHandler };
	}, [delay, onHideHandler, onShowHandler, state]);

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
			lastHandlers.current.onHideHandler();
		}
		// @ts-ignore
		apiRef.current = null;
		// @ts-ignore
		hasCalledShowHandler.current = false;
		// just in case
		setState('hide');
	}, []);

	const abort = useCallback(() => {
		if (!apiRef.current) {
			return;
		}
		apiRef.current.abort();
		// Only call onHideHandler if we have called onShowHandler
		if (hasCalledShowHandler.current) {
			lastHandlers.current.onHideHandler();
		}
		// @ts-ignore
		apiRef.current = null;
	}, []);
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

	const showTooltip = useCallback(
		(source: Source) => {
			/**
			 * Prevent tooltips from being shown during a drag. This can occur with
			 * the native drag and drop API, where some pointer events can fire
			 * when they should not and lead to jank with tooltips.
			 */
			if (isDraggingRef.current) {
				return;
			}

			if (apiRef.current && !apiRef.current.isActive()) {
				abort();
			}

			// Tell the tooltip to keep showing
			if (apiRef.current && apiRef.current.isActive()) {
				apiRef.current.keep();
				return;
			}

			const entry: Entry = {
				source,
				delay: lastDelay.current,
				show: ({ isImmediate }) => {
					// Call the onShow handler if it hasn't been called yet
					if (!hasCalledShowHandler.current) {
						hasCalledShowHandler.current = true;
						lastHandlers.current.onShowHandler();
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
				done: done,
			};

			const api: API = show(entry);
			start(api);
		},
		[abort, done, start],
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
			showTooltip(source);
		},
		[position, showTooltip],
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
		showTooltip({ type: 'keyboard' });
	}, [showTooltip]);

	const onBlur = useCallback(() => {
		if (apiRef.current) {
			apiRef.current.requestHide({ isImmediate: false });
		}
	}, []);

	const onAnimationFinished = useCallback((transition: Transition) => {
		// Using lastState here because motion is not picking up the latest value
		if (transition === 'exiting' && lastState.current === 'fade-out' && apiRef.current) {
			// @ts-ignore: refs are writeable
			apiRef.current.finishHideAnimation();
		}
	}, []);

	// Doing a cast because typescript is struggling to narrow the type
	const CastTargetContainer = TargetContainer as React.ElementType;

	const shouldRenderTooltipContainer: boolean = state !== 'hide' && Boolean(content);

	const shouldRenderTooltipChildren: boolean = state !== 'hide' && state !== 'fade-out';

	useNotifyOpenLayerObserver({ isOpen: shouldRenderTooltipContainer });

	const getReferenceElement = () => {
		if (position === 'mouse' && apiRef.current?.mousePosition) {
			return apiRef.current?.mousePosition;
		}

		return targetRef.current || undefined;
	};

	const tooltipId = useUniqueId('tooltip', shouldRenderTooltipContainer);

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
	useEffect(() => {
		// If there is no container element, we should exit early, because that
		// means they are using the render prop API, and that is implemented in a
		// different way. If there is no target element yet or tooltipId, we also
		// shouldn't do anything because there is nothing to operate on or with.
		if (!containerRef.current || !targetRef.current || !tooltipId) {
			return;
		}

		const target = targetRef.current;

		if (shouldRenderTooltipContainer) {
			target.setAttribute('aria-describedby', tooltipId);
		} else {
			target.removeAttribute('aria-describedby');
		}
	}, [shouldRenderTooltipContainer, tooltipId]);

	const hiddenContent = (
		<span data-testid={testId ? `${testId}-hidden` : undefined} hidden id={tooltipId}>
			{typeof content === 'function' ? content({}) : content}
		</span>
	);

	return (
		<>
			{typeof children === 'function' ? (
				// once we deprecate the wrapped approach, we can put the aria
				// attribute back into the tooltipTriggerProps and make it required
				// instead of optional in `types`
				<>
					{children({
						...tooltipTriggerProps,
						'aria-describedby': tooltipId,
						ref: setDirectRef,
					})}
					{/* render a hidden tooltip content for screen readers to announce */}
					{shouldRenderTooltipContainer && hiddenContent}
				</>
			) : (
				<CastTargetContainer
					{...tooltipTriggerProps}
					ref={setImplicitRefFromChildren}
					role="presentation"
				>
					{children}
					{/* render a hidden tooltip content for screen readers to announce */}
					{shouldRenderTooltipContainer && hiddenContent}
				</CastTargetContainer>
			)}

			{shouldRenderTooltipContainer ? (
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
