/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	Fragment,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';

import { useId } from '@atlaskit/ds-lib/use-id';
import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { useOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { blockDraggingToIFrames } from '@atlaskit/pragmatic-drag-and-drop/element/block-dragging-to-iframes';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { PanelSplitterContext } from './context';
import { convertResizeBoundToPixels } from './convert-resize-bound-to-pixels';
import { getPercentageWithinPixelBounds } from './get-percentage-within-pixel-bounds';
import { getPixelWidth, getWidthFromDragLocation } from './get-width';
import { createKeyboardResizeManager } from './keyboard-resize-manager';
import type {
	PixelResizeBounds,
	ResizeBounds,
	ResizeEndCallback,
	ResizeStartCallback,
} from './types';
import { useTextDirection } from './use-text-direction';

const containerStyles = cssMap({
	root: {
		display: 'none',
		position: 'absolute',
		insetBlockEnd: 0,
		insetBlockStart: 0,
		outline: 'none',
		'@media (min-width: 48rem)': {
			display: 'block',
		},
		// We need to make sure the panel splitter stays above other elements.
		// Concrete examples of this are when elements inside the side nav are sticky and have their own zindex set.
		// For now we set this to the smallest possible value. We might need to increase this in the future.
		zIndex: 1,
	},
	positionEnd: {
		// Offset 8px to the left of the container's right (inline-end) side, to position the grab area.
		insetInlineEnd: '8px',
	},
	positionStart: {
		// Offset 9px to the left of the container's left (inline-start) side, to position the grab area.
		// 9px is used instead of 8px (an extra 1px) to go over the container element's border and centre it.
		insetInlineStart: '-9px',
	},
});

const grabAreaStyles = cssMap({
	root: {
		/**
		 * The interactive grab area is centered on the container element's border. `17px` is used as the grab area covers `8px` on one side
		 * and `8px` on the other side, plus an extra `1px` to account for the container element's border.
		 */
		width: '17px',
		height: '100%',
		position: 'absolute',
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		color: 'transparent',
		backgroundColor: 'transparent',
		transitionProperty: 'color',
		transitionDuration: '100ms',
		transitionDelay: '0ms',
		'&:hover': {
			// We are setting the cursor within the :hover pseudo to ensure the specifity is higher than Pressable's cursor.
			cursor: 'ew-resize',
			transitionDelay: '200ms',
		},
		'&:hover, &:focus-within': {
			color: token('color.text.selected'),
			transitionProperty: 'color',
			transitionDuration: '200ms',
		},
		// We are using the `:active` state to update the line color when dragging, instead of using state. This works as we aren't using
		// drag previews and instead are moving and styling the dragged element. There were also issues with the Compiled styles in test environments.
		'&:active': {
			color: token('color.link.pressed'),
			// Removing the color transition so we instantly change from hovered to dragged colors.
			transition: 'none',
		},
	},
});

const lineStyles = cssMap({
	root: {
		position: 'absolute',
		display: 'block',
		width: token('border.width.indicator'),
		height: '100%',
		color: 'inherit',
		backgroundColor: 'currentcolor',
		// 7px is used instead of 8px to account for the container element's border and ensure the line remains visually centered.
		insetInlineStart: '7px',
	},
});

type PanelSplitterProps = {
	/**
	 * The accessible label for the panel splitter. It is visually hidden, but is required for accessibility.
	 */
	label: React.ReactNode;

	/**
	 * Called when the user begins resizing the panel.
	 * Intended for analytics.
	 */
	onResizeStart?: ResizeStartCallback;

	/**
	 * Called when the user finishes resizing the panel.
	 */
	onResizeEnd?: ResizeEndCallback;

	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
};

type PanelSplitterDragData = {
	panelId: string | symbol | undefined;
	initialWidth: number;
	resizingWidth: string;
	resizeBounds: ResizeBounds;
};

const panelSplitterDragDataSymbol = Symbol('panel-splitter-drag-data');

function signPanelSplitterDragData(data: PanelSplitterDragData) {
	return { ...data, [panelSplitterDragDataSymbol]: true };
}

export function isPanelSplitterDragData(
	data: Record<string | symbol, unknown>,
): data is PanelSplitterDragData {
	return data[panelSplitterDragDataSymbol] === true;
}

const PortaledPanelSplitter = ({
	label,
	onResizeStart,
	onResizeEnd,
	testId,
}: PanelSplitterProps): JSX.Element | null => {
	const splitterRef = useRef<HTMLDivElement | null>(null);

	const panelSplitterContext = useContext(PanelSplitterContext);
	invariant(panelSplitterContext, 'Panel splitter context must be set');
	const {
		panelId,
		panelWidth,
		onCompleteResize,
		getResizeBounds,
		panelRef,
		resizingCssVar,
		portalRef,
		position,
		isEnabled,
	} = panelSplitterContext;
	invariant(portalRef.current, 'Portal ref must be set');

	const direction = useTextDirection(portalRef.current);
	const labelId = useId();
	// Separate state used for the input range width to remove the UI's dependency on the "persisted" layout state value being updated
	const [rangeInputValue, setRangeInputValue] = useState(panelWidth);

	/**
	 * We are using state to store the resize bounds _converted into pixel units_, so that we can update them when the window is resized.
	 * Otherwise they can become out of sync with the actual viewport size, and cause a broken experience (inaccurate width percentage)
	 * when the user tries to resize using the keyboard.
	 */
	const [rangeInputBounds, setRangeInputBounds] = useState<PixelResizeBounds>({
		// Using placeholder values here for the initial render. These will be calculated and updated when the range input is focused.
		min: 200,
		max: 500,
	});

	const openLayerObserver = useOpenLayerObserver();

	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		const splitter = splitterRef.current;
		invariant(splitter, 'Splitter ref must be set');

		return combine(
			blockDraggingToIFrames({ element: splitter }),
			draggable({
				element: splitter,
				onGenerateDragPreview: ({ nativeSetDragImage }) => {
					// We will be moving the line to indicate a drag. We can disable the native drag preview
					disableNativeDragPreview({ nativeSetDragImage });
					// We don't want any native drop animation for when the user does not drop on a drop target. We want the drag to finish immediately
					preventUnhandled.start();
				},
				getInitialData() {
					invariant(panelRef.current, 'Panel ref must be set');

					const initialWidth = getPixelWidth(panelRef.current);

					/**
					 * The drag calculations require the actual computed width of the element
					 * For example, if the panel has loaded with a width of 2000px, but the max bound is 1000px and is visually 1000px (due to the CSS `clamp()`),
					 * the drag calculations should use the actual width of 1000px, not the width in state of 2000px.
					 */
					return signPanelSplitterDragData({
						panelId,
						initialWidth,
						resizingWidth: `${initialWidth}px`,
						resizeBounds: getResizeBounds(),
					});
				},
				onDragStart({ source }) {
					invariant(isPanelSplitterDragData(source.data));

					onResizeStart?.({ initialWidth: source.data.initialWidth });

					// Close any open layers when the user starts resizing
					openLayerObserver?.closeLayers();
				},
				onDrag({ location, source }) {
					invariant(isPanelSplitterDragData(source.data));

					const { initialWidth, resizeBounds } = source.data;

					/**
					 * How wide the element would be if there were no width constraints,
					 * based on the pointer's position.
					 */
					const targetWidth = getWidthFromDragLocation({
						initialWidth,
						location,
						direction,
						position,
					});

					const resizingWidth = `clamp(${resizeBounds.min}, ${targetWidth}px, ${resizeBounds.max})`;

					panelRef.current?.style.setProperty(resizingCssVar, resizingWidth);

					source.data.resizingWidth = resizingWidth;
				},
				onDrop({ source }) {
					invariant(isPanelSplitterDragData(source.data));

					preventUnhandled.stop();
					invariant(panelRef.current, 'Panel ref must be set');
					invariant(isPanelSplitterDragData(source.data));

					const finalWidth = getPixelWidth(panelRef.current);
					onCompleteResize(finalWidth);
					onResizeEnd?.({
						initialWidth: source.data.initialWidth,
						finalWidth,
					});

					panelRef.current.style.removeProperty(resizingCssVar);
				},
			}),
		);
	}, [
		onCompleteResize,
		onResizeStart,
		onResizeEnd,
		panelRef,
		resizingCssVar,
		panelWidth,
		direction,
		position,
		isEnabled,
		openLayerObserver,
		panelId,
		getResizeBounds,
	]);

	const onResizeStartStableRef = useStableRef(onResizeStart);
	const onResizeEndStableRef = useStableRef(onResizeEnd);

	const [keyboardResizeManager] = useState(() =>
		createKeyboardResizeManager({
			onResizeStart: (...args) => {
				// Close any open layers when the user starts resizing with keyboard
				openLayerObserver?.closeLayers();

				onResizeStartStableRef.current?.(...args);
			},
			onResizeEnd: (...args) => onResizeEndStableRef.current?.(...args),
		}),
	);

	const handleSliderInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = parseInt(event.target.value);
			setRangeInputValue(value);

			/**
			 * We are intentionally _not_ debouncing `onCompleteResize` as we want it to be called anytime the user changes the range input value.
			 * It is an internal-only callback - it's provided by `PanelSplitterProvider`, and used by layout slots to update their layout width state.
			 */
			onCompleteResize(value);
			keyboardResizeManager.onResize({ initialWidth: panelWidth, finalWidth: value });
		},
		[onCompleteResize, panelWidth, keyboardResizeManager],
	);

	const resizeEventListenerCleanupFn = useRef<(() => void) | null>(null);

	const handleSliderFocus = useCallback(() => {
		/**
		 * We are only updating the range input's properties when the element is focused, as a performance optimisation.
		 * It isn't necessary to recalculate these values until the element is going to be used.
		 */

		// Clean up any left over listeners in case `focus` was triggered again without `blur`.
		resizeEventListenerCleanupFn.current?.();

		// Update the range input value to match the current panel width.
		setRangeInputValue(panelWidth);

		const resizeBounds = getResizeBounds();

		// Update the range input bounds to ensure they are accurate (in case the viewport was previously resized)
		setRangeInputBounds({
			min: convertResizeBoundToPixels(resizeBounds.min),
			max: convertResizeBoundToPixels(resizeBounds.max),
		});

		/**
		 * _While the slider element is focused_, add a window resize event listener to update the range input bounds
		 * when the window is resized. This is needed to ensure the min and max widths accurately reflect the viewport
		 * size - in case they are provided in vw units.
		 *
		 * This listener is cleaned up when the element is blurred.
		 */
		resizeEventListenerCleanupFn.current = bind(window, {
			type: 'resize',
			listener: function updateState() {
				const resizeBounds = getResizeBounds();

				setRangeInputBounds({
					min: convertResizeBoundToPixels(resizeBounds.min),
					max: convertResizeBoundToPixels(resizeBounds.max),
				});
			},
		});
	}, [panelWidth, getResizeBounds]);

	const handleSliderBlur = useCallback(() => {
		// Remove the resize event listener when the range input is blurred.
		resizeEventListenerCleanupFn.current?.();
	}, []);

	useEffect(() => {
		return function cleanup() {
			// Cleanup the resize event listener when the component is unmounted.
			resizeEventListenerCleanupFn.current?.();
		};
	}, []);

	const ariaValueText = useMemo(
		() =>
			`${getPercentageWithinPixelBounds({ currentWidth: rangeInputValue, resizeBounds: rangeInputBounds })}% width`,
		[rangeInputValue, rangeInputBounds],
	);

	if (!isEnabled) {
		return null;
	}

	return createPortal(
		<div
			css={[
				containerStyles.root,
				position === 'start' && containerStyles.positionStart,
				position === 'end' && containerStyles.positionEnd,
			]}
			data-testid={testId ? `${testId}-container` : undefined}
		>
			<div ref={splitterRef} css={grabAreaStyles.root} data-testid={testId}>
				<VisuallyHidden>
					<input
						type="range"
						value={rangeInputValue}
						step={20}
						min={rangeInputBounds.min}
						max={rangeInputBounds.max}
						aria-valuetext={ariaValueText}
						aria-labelledby={labelId}
						onChange={handleSliderInputChange}
						onFocus={handleSliderFocus}
						onBlur={handleSliderBlur}
					/>
					<span id={labelId}>{label}</span>
				</VisuallyHidden>
				<span css={lineStyles.root} />
			</div>
		</div>,
		portalRef.current,
	);
};

// Ensures that the component is only rendered on a client. Uses a `useEffect`, which is not run on servers.
const ClientOnly = ({ children }: { children: ReactNode }): JSX.Element => {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return <Fragment>{hasMounted ? children : null}</Fragment>;
};

/**
 * _PanelSplitter_
 *
 * A component that allows the user to resize a layout area.
 * It can be used within layout areas like `SideNav`, `Panel`, and `Aside`. The layout area component should
 * provide the context for it using `<PanelSplitterProvider>`.
 *
 * Example usage in products:
 * ```tsx
 * <SideNav>
 *   {/* other side nav content *}
 *   <PanelSplitter label="Resize Side Nav" />
 * </SideNav>
 * ```
 */
export const PanelSplitter = ({
	label,
	onResizeStart,
	onResizeEnd,
	testId,
}: PanelSplitterProps): JSX.Element => (
	<ClientOnly>
		<PortaledPanelSplitter
			label={label}
			onResizeStart={onResizeStart}
			onResizeEnd={onResizeEnd}
			testId={testId}
		/>
	</ClientOnly>
);
