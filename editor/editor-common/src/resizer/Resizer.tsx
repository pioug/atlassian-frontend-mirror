import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import type { CSSProperties, ForwardRefRenderFunction, PropsWithChildren } from 'react';

import classnames from 'classnames';
import type { HandleComponent, ResizeDirection } from 're-resizable';
import { Resizable } from 're-resizable';
import { useIntl } from 'react-intl-next';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import type { TooltipProps } from '@atlaskit/tooltip';

import { messages } from '../messages/breakout';
import {
	handleWrapperClass,
	resizerDangerClassName,
	resizerExtendedZone,
	resizerHandleClassName,
	resizerHandleThumbClassName,
	resizerHandleTrackClassName,
	resizerHandleZIndex,
	resizerHoverZoneClassName,
	resizerItemClassName,
} from '../styles/shared/resizer';

import type {
	Dimensions,
	EnabledHandles,
	HandleAlignmentMethod,
	HandleHighlight,
	HandlePositioning,
	HandleResize,
	HandleResizeStart,
	HandleSize,
	HandleStyles,
	ResizerAppearance,
	Snap,
} from './types';

const resizerLabelStyles = xcss({
	position: 'absolute',
	bottom: token('space.0', '0'),
	width: '100%',
	overflow: 'visible',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: token('space.0', '0px'),
	zIndex: 'layer', // 400 same z-index as the floating toolbar
});

export type ResizerProps = {
	// sets class name for the resizable component on top of default styles
	// (resizerItemClassName in packages/editor/editor-common/src/styles/shared/resizer.ts)
	className?: string;
	// Enables resizing in left and/or right direction and enables handles
	enable: EnabledHandles;
	// initial width for now as Resizer is using defaultSize - defaults to 'auto' if not provided
	width?: number;
	minWidth?: number | string;
	maxWidth?: number | string;
	// The snap property is used to specify absolute pixel values that resizing should snap to.
	// x and y are both optional, allowing you to only include the axis you want to define. Defaults to null.
	snap?: Snap;
	// The snapGap property is used to specify the minimum gap required in order to move to the next snapping target.
	// Defaults to 0 which means that snap targets are always used.
	snapGap?: number;
	// Ratio that will scale the delta by
	resizeRatio?: number;
	appearance?: ResizerAppearance;

	// control visibility of resize handle, by default handle is only visible on hover of element resizing
	isHandleVisible?: boolean;
	// Resizer lifecycle callbacks:
	handleResizeStart: HandleResizeStart;
	handleResize?: HandleResize;
	handleResizeStop: HandleResize;
	/**
	 * This can be used to override the css class name applied to the resize handle.
	 */
	handleClassName?: string;
	/**
	 * This is used to override the style of resize handles wrapper.
	 */
	handleWrapperStyle?: CSSProperties;
	/**
	 * This property is used to override the style of one or more resize handles. Only the axis you specify will have
	 * its handle style overriden.
	 */
	handleStyles?: HandleStyles;
	/**
	 * The handleAlignmentMethod is used in determining the vertical positioning of the resizer handle in relation to its children.
	 */
	handleAlignmentMethod?: HandleAlignmentMethod;
	/**
	 * The handlePositioning is used to determine the horizontal position of the resizer handle in relation to its children.
	 */
	handlePositioning?: HandlePositioning;
	/**
	 * The handleSize is used to determine the width/height of the handle element.
	 *
	 * **To be deprecated** and replaced with 'clamped' by default
	 */
	handleSize?: HandleSize;
	/**
	 * The handleHighlight is used to determine how the handle looks when the users mouse hovers over the handle element.
	 */
	handleHighlight?: HandleHighlight;
	/**
	 * The handle can display a tooltip when mouse hovers.
	 */
	handleTooltipContent?: TooltipProps['content'];

	/**
	 * control if extended resize zone is needed, by default we apply it to the resizer
	 */
	needExtendedResizeZone?: boolean;

	/**
	 * Additional styles to be applied to the resizer component
	 */
	style?: CSSProperties;

	/**
	 * Access to the inner most element which wraps passed children
	 */
	childrenDOMRef?: (ref: HTMLElement | null) => void;

	/**
	 * Children of the component, this is going to be display below the resizer
	 * useful for displaying a label such as size or layout
	 */
	labelComponent?: React.ReactNode;
};

type forwardRefType = {
	getResizerThumbEl: () => HTMLButtonElement | null;
};

const SUPPORTED_HANDLES: ['left', 'right'] = ['left', 'right'];

const inheritedCSS: CSSProperties = {
	position: 'inherit',
	height: 'inherit',
	width: 'inherit',
	display: 'inherit',
	flexDirection: 'inherit',
	justifyContent: 'inherit',
	alignItems: 'inherit',
};

const ResizerNext: ForwardRefRenderFunction<forwardRefType, PropsWithChildren<ResizerProps>> = (
	props,
	ref,
) => {
	const [isResizing, setIsResizing] = useState(false);
	const resizable = useRef<Resizable>(null);
	const resizeHandleThumbRef = useRef<HTMLButtonElement>(null);

	useImperativeHandle(ref, () => {
		return {
			getResizerThumbEl() {
				return resizeHandleThumbRef.current;
			},
		};
	}, [resizeHandleThumbRef]);

	const {
		width,
		children,
		handleClassName,
		className,
		handleResize,
		handleResizeStart,
		handleResizeStop,
		handleSize = 'medium',
		handleAlignmentMethod = 'center',
		handlePositioning = 'overlap',
		appearance,
		handleStyles,
		resizeRatio = 1,
		snap,
		snapGap,
		isHandleVisible = false,
		handleHighlight = 'none',
		handleTooltipContent,
		needExtendedResizeZone = true,
		childrenDOMRef,
		labelComponent,
		...otherProps
	} = props;

	const onResizeStart = useCallback(
		(event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
			// prevent creating a drag event on Firefox
			event.preventDefault();

			setIsResizing(true);
			handleResizeStart();
		},
		[handleResizeStart],
	);

	const onResize = useCallback(
		(
			_event: MouseEvent | TouchEvent,
			_direction: ResizeDirection,
			_elementRef: HTMLDivElement,
			delta: Dimensions,
		) => {
			if (!handleResize) {
				return;
			}
			const resizableCurrent = resizable.current;
			if (!resizableCurrent || !resizableCurrent.state.original) {
				return;
			}

			const originalState = {
				x: resizableCurrent.state.original.x,
				y: resizableCurrent.state.original.y,
				width: resizableCurrent.state.original.width,
				height: resizableCurrent.state.original.height,
			};
			handleResize(originalState, delta);
		},
		[handleResize],
	);

	const onResizeStop = useCallback(
		(
			_event: MouseEvent | TouchEvent,
			_direction: ResizeDirection,
			_elementRef: HTMLElement,
			delta: Dimensions,
		) => {
			const resizableCurrent = resizable.current;
			if (!resizableCurrent || !resizableCurrent.state.original) {
				return;
			}

			const originalState = {
				x: resizableCurrent.state.original.x,
				y: resizableCurrent.state.original.y,
				width: resizableCurrent.state.original.width,
				height: resizableCurrent.state.original.height,
			};

			setIsResizing(false);
			handleResizeStop(originalState, delta);
		},
		[handleResizeStop],
	);

	const handles = {
		left: classnames(
			handleClassName ?? resizerHandleClassName,
			'left',
			handleSize,
			handleAlignmentMethod,
		),
		right: classnames(
			handleClassName ?? resizerHandleClassName,
			'right',
			handleSize,
			handleAlignmentMethod,
		),
	};

	const baseHandleStyles: CSSProperties = {
		width:
			handlePositioning === 'adjacent' ? token('space.100', '8px') : token('space.300', '24px'),
		zIndex: resizerHandleZIndex,
		pointerEvents: 'auto',
		alignItems: handlePositioning === 'adjacent' ? 'center' : undefined,
	};

	const offset =
		handlePositioning === 'adjacent'
			? `calc(${baseHandleStyles.width} * -1)`
			: `calc(${baseHandleStyles.width} * -0.5)`;

	const nextHandleStyles = SUPPORTED_HANDLES.reduce<HandleStyles>(
		(result, position) => ({
			...result,
			[position]: {
				...baseHandleStyles,
				[position]: offset,
				...handleStyles?.[position],
			},
		}),
		{},
	);

	const resizerClassName = classnames(className, resizerItemClassName, {
		'is-resizing': isResizing,
		'display-handle': isHandleVisible,
		[resizerDangerClassName]: appearance === 'danger',
	});

	const resizerZoneClassName = classnames(resizerHoverZoneClassName, {
		[resizerExtendedZone]: needExtendedResizeZone,
	});

	const { formatMessage } = useIntl();
	const handleComponent = useMemo(() => {
		return SUPPORTED_HANDLES.reduce<HandleComponent>((result, position) => {
			const thumb = (
				<button
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={resizerHandleThumbClassName}
					data-testid={`resizer-handle-${position}-thumb`}
					aria-label={formatMessage(messages.resizeHandle)}
					contentEditable={false}
					ref={resizeHandleThumbRef}
					type="button"
					tabIndex={-1} //We want to control focus on this button ourselves
				/>
			);

			if ((!handleHighlight || handleHighlight === 'none') && !handleTooltipContent) {
				return {
					...result,
					[position]: thumb,
				};
			}

			const thumbWithTrack = (
				//It's important to have {thumb} element before the div, the thumb element is the one that gets focus and only the 1st element recives aria-descibedby attribute which is important for screen reader users
				<>
					{thumb}
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={classnames(resizerHandleTrackClassName, handleHighlight)}
						data-testid={`resizer-handle-${position}-track`}
					/>
				</>
			);

			if (!!handleTooltipContent) {
				return {
					...result,
					[position]: (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						<div contentEditable={false} style={inheritedCSS}>
							<Tooltip
								content={handleTooltipContent}
								hideTooltipOnClick
								position="mouse"
								mousePosition="auto-start"
								testId={`resizer-handle-${position}-tooltip`}
							>
								{thumbWithTrack}
							</Tooltip>
						</div>
					),
				};
			}

			return {
				...result,
				[position]: (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<div contentEditable={false} style={inheritedCSS}>
						{thumbWithTrack}
					</div>
				),
			};
		}, {});
	}, [handleHighlight, handleTooltipContent, formatMessage]);

	// snapGap is usually a constant, if snap.x?.length is 0 and snapGap has a value resizer cannot be resized
	const snapGapActual = useMemo(() => {
		if (!snap || (snap.x?.length === 0 && snap.y?.length === 0)) {
			return undefined;
		}
		return snapGap;
	}, [snap, snapGap]);

	return (
		<Resizable
			ref={resizable}
			size={{
				width: width ?? 'auto', // just content itself (no paddings)
				height: 'auto',
			}}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={resizerClassName}
			handleClasses={handles}
			handleWrapperClass={handleWrapperClass}
			handleStyles={nextHandleStyles}
			onResizeStart={onResizeStart}
			onResize={onResize}
			onResizeStop={onResizeStop}
			resizeRatio={resizeRatio}
			snapGap={snapGapActual}
			snap={snap}
			handleComponent={handleComponent}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...otherProps}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<span className={resizerZoneClassName} ref={(ref) => childrenDOMRef && childrenDOMRef(ref)}>
				{children}
			</span>
			{labelComponent && editorExperiment('single_column_layouts', true) && (
				<Box xcss={resizerLabelStyles}>{labelComponent}</Box>
			)}
		</Resizable>
	);
};

export default forwardRef(ResizerNext);
