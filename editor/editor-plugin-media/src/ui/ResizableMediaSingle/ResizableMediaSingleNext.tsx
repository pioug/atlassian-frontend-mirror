/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import classnames from 'classnames';
import type { Mapping } from 'classnames';
import throttle from 'lodash/throttle';

import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import {
	findClosestSnap,
	generateDefaultGuidelines,
	generateDynamicGuidelines,
	getGuidelineSnaps,
	getGuidelinesWithHighlights,
	getGuidelineTypeFromKey,
	getRelativeGuidelines,
	getRelativeGuideSnaps,
} from '@atlaskit/editor-common/guideline';
import type {
	GuidelineConfig,
	GuidelineSnapsReference,
	RelativeGuides,
} from '@atlaskit/editor-common/guideline';
import {
	calcMediaSingleMaxWidth,
	DEFAULT_IMAGE_WIDTH,
	MEDIA_SINGLE_ADJACENT_HANDLE_MARGIN,
	MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
	MEDIA_SINGLE_RESIZE_THROTTLE_TIME,
	MEDIA_SINGLE_SNAP_GAP,
	MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH,
} from '@atlaskit/editor-common/media-single';
import type { Dimensions, HandleResize, Position, Snap } from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { resizerStyles, richMediaClassName } from '@atlaskit/editor-common/styles';
import type { Command } from '@atlaskit/editor-common/types';
import {
	calcPctFromPx,
	handleSides,
	imageAlignmentMap,
	wrappedLayouts,
} from '@atlaskit/editor-common/ui';
import { nonWrappedLayouts } from '@atlaskit/editor-common/utils';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import {
	MEDIA_PLUGIN_IS_RESIZING_KEY,
	MEDIA_PLUGIN_RESIZING_WIDTH_KEY,
} from '../../pm-plugins/main';
import { getMediaResizeAnalyticsEvent } from '../../pm-plugins/utils/analytics';
import { checkMediaType } from '../../pm-plugins/utils/check-media-type';

import { ResizableMediaMigrationNotification } from './ResizableMediaMigrationNotification';
import { wrapperStyle } from './styled';
import type { EnabledHandles, Props } from './types';

export const resizerNextTestId = 'mediaSingle.resizerNext.testid';

type ResizableMediaSingleNextProps = Props & {
	showLegacyNotification?: boolean;
};

const calcPxHeight = (props: {
	newWidth: number;
	previousWidth: number;
	previousHeight: number;
}): number => {
	const { newWidth, previousWidth, previousHeight } = props;

	return Math.round((previousHeight / previousWidth) * newWidth);
};

const calcMinWidth = ({
	isVideoFile,
	contentWidth,
}: {
	isVideoFile: boolean;
	contentWidth?: number;
}) => {
	return Math.min(
		contentWidth || akEditorDefaultLayoutWidth,
		isVideoFile ? MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH : MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
	);
};

const calcMaxWidth = ({
	containerWidth,
	editorAppearance,
}: {
	containerWidth: number;
	editorAppearance: ResizableMediaSingleNextProps['editorAppearance'];
}) => {
	return calcMediaSingleMaxWidth(containerWidth, editorAppearance);
};

const setIsResizingPluginState =
	({
		isResizing,
		nodePosition,
		initialWidth,
	}: {
		isResizing: boolean;
		nodePosition?: number | null;
		initialWidth?: number | undefined;
	}): Command =>
	(state, dispatch) => {
		const tr = state.tr;
		tr.setMeta(MEDIA_PLUGIN_IS_RESIZING_KEY, isResizing);
		tr.setMeta('is-resizer-resizing', isResizing);

		if (isResizing && typeof nodePosition === 'number') {
			tr.setSelection(NodeSelection.create(state.doc, nodePosition));
		}

		if (isResizing && typeof initialWidth === 'number') {
			tr.setMeta(MEDIA_PLUGIN_RESIZING_WIDTH_KEY, initialWidth);
		}

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};

const calcUnwrappedLayout = (
	width: number,
	containerWidth: number,
	contentWidth: number,
	fullWidthMode?: boolean,
	isNestedNode?: boolean,
): 'center' | 'wide' | 'full-width' => {
	if (isNestedNode) {
		return 'center';
	}

	if (fullWidthMode) {
		if (width < contentWidth) {
			return 'center';
		}
		return 'full-width';
	}

	// handle top-level node in fixed-width editor
	if (width <= contentWidth) {
		return 'center';
	}

	const padding =
		containerWidth <= akEditorFullPageNarrowBreakout &&
		expValEquals('platform_editor_preview_panel_responsiveness', 'isEnabled', true)
			? akEditorGutterPaddingReduced
			: akEditorGutterPaddingDynamic();

	if (width < Math.min(containerWidth - padding * 2, akEditorFullWidthLayoutWidth)) {
		return 'wide';
	}

	// set full width to be containerWidth - padding * 2
	// instead of containerWidth - akEditorBreakoutPadding,
	// so that we have image aligned with text
	return 'full-width';
};

type CalcProps = {
	layout: ResizableMediaSingleNextProps['layout'];
	containerWidth: ResizableMediaSingleNextProps['containerWidth'];
	lineLength: ResizableMediaSingleNextProps['lineLength'];
	fullWidthMode: ResizableMediaSingleNextProps['fullWidthMode'];
	isNestedNode: boolean;
};
const calcNewLayout =
	({ layout, containerWidth, lineLength, fullWidthMode, isNestedNode }: CalcProps) =>
	(newWidth: number, stop: boolean) => {
		const newPct = calcPctFromPx(newWidth, lineLength) * 100;
		const wrappedLayout = wrappedLayouts.indexOf(layout) > -1;

		if (newPct <= 100 && wrappedLayout) {
			if (!stop || newPct !== 100) {
				return layout;
			}
		}
		return calcUnwrappedLayout(newWidth, containerWidth, lineLength, fullWidthMode, isNestedNode);
	};

const calculateSizeState =
	(props: CalcProps) =>
	(
		size: Position & Dimensions,
		delta: Dimensions,
		onResizeStop: boolean = false,
		aspectRatio: number,
	) => {
		const calculatedWidth = Math.round(size.width + delta.width);
		const calculatedWidthWithLayout = calcNewLayout(props)(calculatedWidth, onResizeStop);

		return {
			width: calculatedWidth,
			height: calculatedWidth / aspectRatio,
			layout: calculatedWidthWithLayout,
		};
	};

const getAspectRatio = ({ width, height }: { width: number | undefined; height: number }) => {
	if (width && height > 0) {
		return width / height;
	}

	// TODO: ED-26962 - handle this case
	return 1;
};

const updateSizeInPluginState = throttle(
	({ width, view }: { width?: number; view: EditorView }) => {
		const { state, dispatch } = view;
		const tr = state.tr;
		tr.setMeta(MEDIA_PLUGIN_RESIZING_WIDTH_KEY, width);
		return dispatch(tr);
	},
	MEDIA_SINGLE_RESIZE_THROTTLE_TIME,
);

export const ResizableMediaSingleNextFunctional = (props: ResizableMediaSingleNextProps) => {
	const {
		width: origWidth,
		children,
		containerWidth,
		fullWidthMode,
		layout,
		selected,
		showLegacyNotification,
		className,
		dispatchAnalyticsEvent,
		editorAppearance,
		getPos,
		lineLength,
		mediaSingleWidth,
		height,
		nodeType,
		pluginInjectionApi,
		updateSize,
		view,
		viewMediaClientConfig,
		forceHandlePositioning,
	} = props;

	const initialWidth = useMemo(() => {
		return mediaSingleWidth || DEFAULT_IMAGE_WIDTH;
	}, [mediaSingleWidth]);

	const [dimensions, setDimensions] = useState<Dimensions>({
		width: initialWidth,
		height: calcPxHeight({
			newWidth: initialWidth,
			previousWidth: initialWidth,
			previousHeight: height,
		}),
	});
	const dimensionsRef = useRef(dimensions);
	const lastSnappedGuidelineKeysRef = useRef<string[]>([]);
	const [snaps, setSnaps] = useState<Snap>({});
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [isVideoFile, setIsVideoFile] = useState<boolean>(
		!(fg('platform_editor_media_video_check_fix') || fg('platform_editor_ssr_media')),
	);

	const nodePosition = useMemo(() => {
		if (typeof getPos !== 'function') {
			return null;
		}
		const pos = getPos();
		if (Number.isNaN(pos) || typeof pos !== 'number') {
			return null;
		}
		return pos;
	}, [getPos]);
	const isNestedNode = useMemo(() => {
		if (nodePosition === null) {
			return false;
		}

		const $pos = view.state.doc.resolve(nodePosition);

		return !!($pos && $pos.depth !== 0);
	}, [nodePosition, view]);

	const isAdjacentMode = useMemo(() => {
		if (forceHandlePositioning === 'adjacent') {
			return true;
		}
		return isNestedNode;
	}, [isNestedNode, forceHandlePositioning]);

	const maybeContainerWidth = containerWidth || origWidth;

	const memoizedCss = useMemo(() => {
		return wrapperStyle({
			layout,
			containerWidth: maybeContainerWidth,
			fullWidthMode,
			mediaSingleWidth: dimensions.width,
			isNestedNode: isAdjacentMode,
			isExtendedResizeExperienceOn: true,
		});
	}, [layout, maybeContainerWidth, fullWidthMode, dimensions.width, isAdjacentMode]);

	const maxWidth = useMemo(() => {
		if (editorAppearance === 'chromeless' && forceHandlePositioning === 'adjacent') {
			return containerWidth - MEDIA_SINGLE_ADJACENT_HANDLE_MARGIN * 2;
		}

		if (!isResizing && isAdjacentMode) {
			return undefined;
		}
		if (isAdjacentMode || fullWidthMode) {
			return lineLength;
		}

		return calcMaxWidth({
			containerWidth,
			editorAppearance,
		});
	}, [
		isAdjacentMode,
		fullWidthMode,
		lineLength,
		editorAppearance,
		containerWidth,
		isResizing,
		forceHandlePositioning,
	]);

	const minWidth = calcMinWidth({ isVideoFile, contentWidth: lineLength });

	// while is not resizing, we take 100% as min-width if the container width is less than the min-width
	const minViewWidth = isResizing ? minWidth : `min(${minWidth}px, 100%)`;

	const resizerNextClassName = useMemo(() => {
		// TODO: ED-26962 - Clean up where this lives and how it gets generated
		const classNameNext = classnames(
			richMediaClassName,
			`image-${layout}`,
			isResizing ? 'is-resizing' : 'not-resizing',
			className,
			{
				'richMedia-selected': selected,
				'rich-media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
			},
		);

		return classnames(classNameNext, resizerStyles as unknown as Mapping);
	}, [className, isResizing, layout, selected]);

	const isInsideInlineLike = useMemo(() => {
		if (nodePosition === null) {
			return false;
		}

		const $pos = view.state.doc.resolve(nodePosition);

		const { listItem } = view.state.schema.nodes;
		return !!findParentNodeOfTypeClosestToPos($pos, [listItem]);
	}, [nodePosition, view]);

	const enable: EnabledHandles = useMemo(() => {
		return handleSides.reduce((acc, side) => {
			const oppositeSide = side === 'left' ? 'right' : 'left';
			acc[side] =
				nonWrappedLayouts
					.concat(`wrap-${oppositeSide}` as MediaSingleLayout)
					.concat(`align-${imageAlignmentMap[oppositeSide]}` as MediaSingleLayout)
					.indexOf(layout) > -1;

			if (side === 'left' && isInsideInlineLike) {
				acc[side] = false;
			}

			return acc;
		}, {} as EnabledHandles);
	}, [layout, isInsideInlineLike]);
	const defaultGuidelines = useMemo(() => {
		if (isAdjacentMode) {
			return [];
		}

		return generateDefaultGuidelines(lineLength, containerWidth, fullWidthMode);
	}, [isAdjacentMode, lineLength, containerWidth, fullWidthMode]);

	const relativeGuidesRef = useRef<RelativeGuides>({});
	const guidelinesRef = useRef<GuidelineConfig[]>([]);
	const updateGuidelines = useCallback(() => {
		const { relativeGuides, dynamicGuides } = generateDynamicGuidelines(view.state, lineLength, {
			styles: {
				lineStyle: 'dashed',
			},
			show: false,
		});

		// disable guidelines for nested media single node
		const dynamicGuidelines = isAdjacentMode ? [] : dynamicGuides;
		relativeGuidesRef.current = relativeGuides;
		guidelinesRef.current = [...defaultGuidelines, ...dynamicGuidelines];
	}, [view, lineLength, defaultGuidelines, isAdjacentMode]);

	const isGuidelineEnabled = useMemo(() => {
		return !!pluginInjectionApi?.guideline;
	}, [pluginInjectionApi]);
	const handleResizeStart = useCallback(() => {
		setIsResizing(true);
		setIsResizingPluginState({
			isResizing: true,
			nodePosition,
			initialWidth: dimensionsRef.current.width,
		})(view.state, view.dispatch);

		if (isGuidelineEnabled) {
			updateGuidelines();
		}
	}, [view, nodePosition, updateGuidelines, isGuidelineEnabled]);

	const getRelativeGuides = useCallback(() => {
		if (typeof nodePosition !== 'number') {
			return [];
		}
		const guidelinePluginState = pluginInjectionApi?.guideline?.sharedState?.currentState();
		const { top: topOffset } = guidelinePluginState?.rect || {
			top: 0,
			left: 0,
		};

		const $pos = view.state.doc.resolve(nodePosition);
		const relativeGuides: GuidelineConfig[] =
			$pos && $pos.nodeAfter && dimensionsRef.current.width
				? getRelativeGuidelines(
						relativeGuidesRef.current,
						{
							node: $pos.nodeAfter,
							pos: $pos.pos,
						},
						view,
						lineLength,
						topOffset,
						dimensionsRef.current,
					)
				: [];

		return relativeGuides;
	}, [pluginInjectionApi, nodePosition, view, lineLength]);

	const updateActiveGuidelines = useCallback(
		(
			width = 0,
			guidelines: GuidelineConfig[],
			guidelineSnapsReference: GuidelineSnapsReference,
		) => {
			if (!guidelineSnapsReference.snaps.x) {
				return;
			}
			const { gap, keys: activeGuidelineKeys } = findClosestSnap(
				width,
				guidelineSnapsReference.snaps.x,
				guidelineSnapsReference.guidelineReference,
				MEDIA_SINGLE_SNAP_GAP,
			);

			const relativeGuidelines = activeGuidelineKeys.length ? [] : getRelativeGuides();

			lastSnappedGuidelineKeysRef.current = activeGuidelineKeys.length
				? activeGuidelineKeys
				: relativeGuidelines.map((rg) => rg.key);

			const nextGuideLines = [
				...getGuidelinesWithHighlights(gap, MEDIA_SINGLE_SNAP_GAP, activeGuidelineKeys, guidelines),
				...relativeGuidelines,
			];
			pluginInjectionApi?.guideline?.actions?.displayGuideline(view)({
				guidelines: nextGuideLines,
			});
		},
		[getRelativeGuides, pluginInjectionApi, view],
	);
	const aspectRatioRef = useRef(
		getAspectRatio({
			width: props.width,
			height: props.height,
		}),
	);

	const handleResize: HandleResize = useCallback(
		(size, delta) => {
			const {
				width,
				height,
				layout: newLayout,
			} = calculateSizeState({
				layout,
				containerWidth,
				lineLength,
				fullWidthMode,
				isNestedNode: isAdjacentMode,
			})(size, delta, false, aspectRatioRef.current);

			if (isGuidelineEnabled) {
				const guidelineSnaps = getGuidelineSnaps(guidelinesRef.current, lineLength, layout);
				updateActiveGuidelines(width, guidelinesRef.current, guidelineSnaps);

				const relativeSnaps = getRelativeGuideSnaps(
					relativeGuidesRef.current,
					aspectRatioRef.current,
				);

				setSnaps({
					x: [...(guidelineSnaps.snaps.x || []), ...relativeSnaps],
				});
			}

			setDimensions({
				width,
				height,
			});

			updateSizeInPluginState({
				width,
				view,
			});

			if (newLayout !== layout) {
				updateSize(width, newLayout);
			}
		},
		[
			view,
			updateSize,
			layout,
			isGuidelineEnabled,
			containerWidth,
			lineLength,
			fullWidthMode,
			isAdjacentMode,
			updateActiveGuidelines,
		],
	);

	const handleResizeStop: HandleResize = useCallback(
		(size, delta) => {
			if (typeof nodePosition !== 'number') {
				return;
			}

			const {
				width,
				height,
				layout: newLayout,
			} = calculateSizeState({
				layout,
				containerWidth,
				lineLength,
				fullWidthMode,
				isNestedNode: isAdjacentMode,
			})(size, delta, false, aspectRatioRef.current);

			if (dispatchAnalyticsEvent) {
				const $pos = view.state.doc.resolve(nodePosition);
				const event = getMediaResizeAnalyticsEvent(nodeType || 'mediaSingle', {
					width,
					layout: newLayout,
					widthType: 'pixel',
					snapType: getGuidelineTypeFromKey(
						lastSnappedGuidelineKeysRef.current,
						guidelinesRef.current,
					),
					parentNode: $pos ? $pos.parent.type.name : undefined,
					inputMethod: 'mouse',
				});
				if (event) {
					dispatchAnalyticsEvent(event);
				}
			}

			setIsResizing(false);
			setIsResizingPluginState({
				isResizing: false,
			})(view.state, view.dispatch);
			pluginInjectionApi?.guideline?.actions?.displayGuideline(view)({
				guidelines: [],
			});

			let newWidth = width;
			if (newLayout === 'full-width') {
				// When a node reaches full width in current viewport,
				// update its width with 1800 to align with pixel entry
				newWidth = akEditorFullWidthLayoutWidth;
			}

			setDimensions({
				width: newWidth,
				height,
			});

			updateSize(newWidth, newLayout);
		},
		[
			nodeType,
			dispatchAnalyticsEvent,
			containerWidth,
			fullWidthMode,
			isAdjacentMode,
			layout,
			lineLength,
			view,
			nodePosition,
			pluginInjectionApi,
			updateSize,
		],
	);

	const mountedRef = React.useRef(true);

	useLayoutEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
		};
	}, []);

	useLayoutEffect(() => {
		setDimensions({
			width: initialWidth,
			height: calcPxHeight({
				newWidth: initialWidth,
				previousWidth: initialWidth,
				previousHeight: height,
			}),
		});
	}, [initialWidth, height]);

	useEffect(() => {
		dimensionsRef.current = dimensions;
	}, [dimensions]);

	useEffect(() => {
		if (!viewMediaClientConfig || typeof nodePosition !== 'number') {
			return;
		}

		const mediaNode = view.state.doc.nodeAt(nodePosition + 1);
		if (!mediaNode) {
			return;
		}
		checkMediaType(mediaNode, viewMediaClientConfig).then((mediaType) => {
			if (mountedRef.current) {
				const isVideoFile = mediaType !== 'external' && mediaType !== 'image';
				setIsVideoFile(isVideoFile);
			}
		});
	}, [view, viewMediaClientConfig, nodePosition]);

	const handlePositioning = useMemo(() => {
		if (forceHandlePositioning) {
			return forceHandlePositioning;
		}
		return isAdjacentMode ? 'adjacent' : undefined;
	}, [forceHandlePositioning, isAdjacentMode]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={memoizedCss}
		>
			<ResizerNext
				minWidth={minViewWidth}
				maxWidth={maxWidth}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={resizerNextClassName}
				snapGap={MEDIA_SINGLE_SNAP_GAP}
				enable={enable}
				width={dimensions.width}
				handleResizeStart={handleResizeStart}
				handleResize={handleResize}
				handleResizeStop={handleResizeStop}
				snap={snaps}
				resizeRatio={nonWrappedLayouts.includes(layout) ? 2 : 1}
				data-testid={resizerNextTestId}
				isHandleVisible={selected}
				handlePositioning={handlePositioning}
				handleHighlight="full-height"
			>
				{children}
				{showLegacyNotification && <ResizableMediaMigrationNotification />}
			</ResizerNext>
		</div>
	);
};

const ResizableMediaSingleToggle = ({
	allowBreakoutSnapPoints,
	children,
	className,
	containerWidth,
	dataAttributes,
	disableHandles,
	dispatchAnalyticsEvent,
	editorAppearance,
	fullWidthMode,
	getPos,
	gridSize,
	handleMediaSingleRef,
	hasFallbackContainer,
	height,
	isInsideOfInlineExtension,
	isLoading,
	layout,
	lineLength,
	mediaSingleWidth,
	nodeType,
	pctWidth,
	pluginInjectionApi,
	selected,
	showLegacyNotification,
	size,
	updateSize,
	view,
	viewMediaClientConfig,
	width,
	forceHandlePositioning,
}: ResizableMediaSingleNextProps) => {
	return (
		<ResizableMediaSingleNextFunctional
			allowBreakoutSnapPoints={allowBreakoutSnapPoints}
			// eslint-disable-next-line react/no-children-prop
			children={children}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			containerWidth={containerWidth}
			dataAttributes={dataAttributes}
			disableHandles={disableHandles}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			editorAppearance={editorAppearance}
			fullWidthMode={fullWidthMode}
			getPos={getPos}
			gridSize={gridSize}
			handleMediaSingleRef={handleMediaSingleRef}
			hasFallbackContainer={hasFallbackContainer}
			height={height}
			isInsideOfInlineExtension={isInsideOfInlineExtension}
			isLoading={isLoading}
			layout={layout}
			lineLength={lineLength}
			mediaSingleWidth={mediaSingleWidth}
			nodeType={nodeType}
			pctWidth={pctWidth}
			pluginInjectionApi={pluginInjectionApi}
			selected={selected}
			showLegacyNotification={showLegacyNotification}
			size={size}
			updateSize={updateSize}
			view={view}
			viewMediaClientConfig={viewMediaClientConfig}
			width={width}
			forceHandlePositioning={forceHandlePositioning}
		/>
	);
};
export default ResizableMediaSingleToggle;
