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
import { useIntl } from 'react-intl';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
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
	bottom: token('space.0'),
	width: '100%',
	overflow: 'visible',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: token('space.0'),
	zIndex: 'layer', // 400 same z-index as the floating toolbar
});

export type ResizerProps = {
	appearance?: ResizerAppearance;
	/**
	 * Access to the inner most element which wraps passed children
	 */
	childrenDOMRef?: (ref: HTMLElement | null) => void;
	// sets class name for the resizable component on top of default styles
	// (resizerItemClassName in packages/editor/editor-common/src/styles/shared/resizer.ts)
	className?: string;
	// Enables resizing in left and/or right direction and enables handles
	enable: EnabledHandles;
	/**
	 * The handleAlignmentMethod is used in determining the vertical positioning of the resizer handle in relation to its children.
	 */
	handleAlignmentMethod?: HandleAlignmentMethod;
	/**
	 * This can be used to override the css class name applied to the resize handle.
	 */
	handleClassName?: string;
	/**
	 * The handleHighlight is used to determine how the handle looks when the users mouse hovers over the handle element.
	 */
	handleHighlight?: HandleHighlight;
	/**
	 * The handlePositioning is used to determine the horizontal position of the resizer handle in relation to its children.
	 */
	handlePositioning?: HandlePositioning;
	handleResize?: HandleResize;

	// Resizer lifecycle callbacks:
	handleResizeStart: HandleResizeStart;
	handleResizeStop: HandleResize;
	/**
	 * The handleSize is used to determine the width/height of the handle element.
	 *
	 * **To be deprecated** and replaced with 'clamped' by default
	 */
	handleSize?: HandleSize;
	/**
	 * This property is used to override the style of one or more resize handles. Only the axis you specify will have
	 * its handle style overriden.
	 */
	handleStyles?: HandleStyles;
	/**
	 * The handle can display a tooltip when mouse hovers.
	 */
	handleTooltipContent?: TooltipProps['content'];
	/**
	 * This is used to override the style of resize handles wrapper.
	 */
	handleWrapperStyle?: CSSProperties;
	// initial height for vertical resizing - defaults to 'auto' if not provided
	height?: number | string;
	// control visibility of resize handle, by default handle is only visible on hover of element resizing
	isHandleVisible?: boolean;
	/**
	 * Children of the component, this is going to be display below the resizer
	 * useful for displaying a label such as size or layout
	 */
	labelComponent?: React.ReactNode;
	maxHeight?: number | string;
	maxWidth?: number | string;
	minHeight?: number | string;
	minWidth?: number | string;
	/**
	 * control if extended resize zone is needed, by default we apply it to the resizer
	 */
	needExtendedResizeZone?: boolean;

	// Ratio that will scale the delta by
	resizeRatio?: number;

	// The snap property is used to specify absolute pixel values that resizing should snap to.
	// x and y are both optional, allowing you to only include the axis you want to define. Defaults to null.
	snap?: Snap;

	// The snapGap property is used to specify the minimum gap required in order to move to the next snapping target.
	// Defaults to 0 which means that snap targets are always used.
	snapGap?: number;

	/**
	 * Additional styles to be applied to the resizer component
	 */
	style?: CSSProperties;
	// initial width for now as Resizer is using defaultSize - defaults to 'auto' if not provided
	width?: number;
};

type forwardRefType = {
	getResizerThumbEl: () => HTMLButtonElement | null;
};

const SUPPORTED_HANDLES: Array<keyof EnabledHandles> = ['left', 'right'];
const SUPPORTED_HANDLES_FOR_VERTICAL_RESIZE: Array<keyof EnabledHandles> = [
	'left',
	'right',
	'bottom',
];

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
		height,
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

	const isDatabasesV2Enabled =
		expValEqualsNoExposure('cc-maui-experiment', 'isEnabled', true) &&
		expValEquals('databases-native-embeds-v2', 'isEnabled', true);

	const supportedHandles = isDatabasesV2Enabled
		? SUPPORTED_HANDLES_FOR_VERTICAL_RESIZE
		: SUPPORTED_HANDLES;

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
			direction: ResizeDirection,
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
			if (isDatabasesV2Enabled) {
				handleResize(originalState, delta, direction);
			} else {
				handleResize(originalState, delta);
			}
		},
		[handleResize, isDatabasesV2Enabled],
	);

	const onResizeStop = useCallback(
		(
			_event: MouseEvent | TouchEvent,
			direction: ResizeDirection,
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
			if (isDatabasesV2Enabled) {
				handleResizeStop(originalState, delta, direction);
			} else {
				handleResizeStop(originalState, delta);
			}
		},
		[handleResizeStop, isDatabasesV2Enabled],
	);

	const handles = useMemo(
		() =>
			supportedHandles.reduce<Record<keyof EnabledHandles, string>>(
				(result, position) => ({
					...result,
					[position]: classnames(
						handleClassName ?? resizerHandleClassName,
						position,
						handleSize,
						position === 'bottom' && isDatabasesV2Enabled ? undefined : handleAlignmentMethod,
					),
				}),
				{} as Record<keyof EnabledHandles, string>,
			),
		[handleClassName, handleSize, handleAlignmentMethod, supportedHandles, isDatabasesV2Enabled],
	);

	const handleWidth = handlePositioning === 'adjacent' ? token('space.100') : token('space.300');
	const baseHorizontalHandleStyles: CSSProperties = {
		width: handleWidth,
		zIndex: resizerHandleZIndex,
		pointerEvents: 'auto',
		alignItems: handlePositioning === 'adjacent' ? 'center' : undefined,
	};
	const baseBottomHandleStyles: CSSProperties = {
		height: handleWidth,
		zIndex: resizerHandleZIndex,
		pointerEvents: 'auto',
		justifyContent: handlePositioning === 'adjacent' ? 'center' : undefined,
	};
	const memoizedBaseHorizontalHandleStyles = useMemo(
		() => ({
			width: handleWidth,
			zIndex: resizerHandleZIndex,
			pointerEvents: 'auto',
			alignItems: handlePositioning === 'adjacent' ? 'center' : undefined,
		}),
		[handleWidth, handlePositioning],
	);
	const memoizedBaseBottomHandleStyles = useMemo(
		() => ({
			height: handleWidth,
			zIndex: resizerHandleZIndex,
			pointerEvents: 'auto',
			justifyContent: handlePositioning === 'adjacent' ? 'center' : undefined,
		}),
		[handleWidth, handlePositioning],
	);

	const offset =
		handlePositioning === 'adjacent' ? `calc(${handleWidth} * -1)` : `calc(${handleWidth} * -0.5)`;

	const memoizedNextHandleStyles = useMemo(
		() =>
			supportedHandles.reduce<HandleStyles>(
				(result, position) => ({
					...result,
					[position]: {
						...(position === 'bottom'
							? memoizedBaseBottomHandleStyles
							: memoizedBaseHorizontalHandleStyles),
						[position]: offset,
						...handleStyles?.[position],
					},
				}),
				{},
			),
		[
			memoizedBaseBottomHandleStyles,
			memoizedBaseHorizontalHandleStyles,
			offset,
			handleStyles,
			supportedHandles,
		],
	);
	const nextHandleStyles = expValEquals('platform_editor_perf_lint_cleanup', 'isEnabled', true)
		? memoizedNextHandleStyles
		: // eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- intentional fallback for experiment off path
			supportedHandles.reduce<HandleStyles>(
				(result, position) => ({
					...result,
					[position]: {
						...(position === 'bottom' ? baseBottomHandleStyles : baseHorizontalHandleStyles),
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
		return supportedHandles.reduce<HandleComponent>((result, position) => {
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
	}, [handleHighlight, handleTooltipContent, formatMessage, supportedHandles]);

	// snapGap is usually a constant, if snap.x?.length is 0 and snapGap has a value resizer cannot be resized
	const snapGapActual = useMemo(() => {
		if (!snap || (snap.x?.length === 0 && snap.y?.length === 0)) {
			return undefined;
		}
		return snapGap;
	}, [snap, snapGap]);

	const resolvedHeight = isDatabasesV2Enabled ? (height ?? 'auto') : 'auto';
	const resizerAutoSize = useMemo(
		() => ({ width: width ?? 'auto', height: resolvedHeight }),
		[resolvedHeight, width],
	);
	const resizerSize = expValEquals('platform_editor_perf_lint_cleanup', 'isEnabled', true)
		? resizerAutoSize
		: // eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- intentional fallback for experiment off path
			{ width: width ?? 'auto', height: resolvedHeight };

	return (
		<Resizable
			ref={resizable}
			size={resizerSize}
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

const _default_1: React.ForwardRefExoticComponent<
	ResizerProps & {
		children?: React.ReactNode | undefined;
	} & React.RefAttributes<forwardRefType>
> = forwardRef(ResizerNext);
export default _default_1;
