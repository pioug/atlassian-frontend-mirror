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
import memoizeOne from 'memoize-one';

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
import type {
	Dimensions,
	HandlePositioning,
	HandleResize,
	HandleResizeStart,
	Position,
	Snap,
} from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { resizerStyles, richMediaClassName } from '@atlaskit/editor-common/styles';
import type { Command } from '@atlaskit/editor-common/types';
import {
	calcPctFromPx,
	handleSides,
	imageAlignmentMap,
	wrappedLayouts,
} from '@atlaskit/editor-common/ui';
import { nonWrappedLayouts, setNodeSelection } from '@atlaskit/editor-common/utils';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
} from '@atlaskit/editor-shared-styles';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	MEDIA_PLUGIN_IS_RESIZING_KEY,
	MEDIA_PLUGIN_RESIZING_WIDTH_KEY,
} from '../../pm-plugins/main';
import { getMediaResizeAnalyticsEvent } from '../../pm-plugins/utils/analytics';
import { checkMediaType } from '../../pm-plugins/utils/check-media-type';

import { ResizableMediaMigrationNotification } from './ResizableMediaMigrationNotification';
import { wrapperStyle } from './styled';
import type { EnabledHandles, Props } from './types';

type State = {
	isVideoFile: boolean;
	isResizing: boolean;
	size: Dimensions;
	snaps: Snap;
	relativeGuides: RelativeGuides;
	guidelines: GuidelineConfig[];
};

export const resizerNextTestId = 'mediaSingle.resizerNext.testid';

type ResizableMediaSingleNextProps = Props & {
	showLegacyNotification?: boolean;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
class ResizableMediaSingleNext extends React.Component<ResizableMediaSingleNextProps, State> {
	private lastSnappedGuidelineKeys: string[] = [];

	constructor(props: ResizableMediaSingleNextProps) {
		super(props);

		const initialWidth = props.mediaSingleWidth || DEFAULT_IMAGE_WIDTH;

		this.state = {
			isVideoFile: true,
			isResizing: false,
			size: {
				width: initialWidth,
				height: this.calcPxHeight(initialWidth),
			},
			snaps: {},
			relativeGuides: {},
			guidelines: [],
		};
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.mediaSingleWidth !== this.props.mediaSingleWidth && this.props.mediaSingleWidth) {
			// update size when lineLength becomes defined later
			// ensures extended experience renders legacy image with the same size as the legacy experience
			const initialWidth = this.props.mediaSingleWidth;

			this.setState({
				size: {
					width: initialWidth,
					height: this.calcPxHeight(initialWidth),
				},
			});
		}

		return true;
	}

	async componentDidMount() {
		const { viewMediaClientConfig } = this.props;
		if (viewMediaClientConfig) {
			await this.checkVideoFile(viewMediaClientConfig);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		if (this.props.viewMediaClientConfig !== nextProps.viewMediaClientConfig) {
			this.checkVideoFile(nextProps.viewMediaClientConfig);
		}
	}

	get wrappedLayout() {
		return wrappedLayouts.indexOf(this.props.layout) > -1;
	}

	get pos() {
		if (typeof this.props.getPos !== 'function') {
			return null;
		}
		const pos = this.props.getPos();
		if (Number.isNaN(pos as unknown) || typeof pos !== 'number') {
			return null;
		}
		return pos;
	}

	get $pos() {
		const pos = this.pos;
		// need to pass view because we may not get updated props in time
		return pos === null ? pos : this.props.view.state.doc.resolve(pos);
	}

	get aspectRatio() {
		const { width, height } = this.props;
		if (width) {
			return width / height;
		}

		// TODO: ED-26962 - handle this case
		return 1;
	}

	get insideInlineLike(): boolean {
		const $pos = this.$pos;
		if (!$pos) {
			return false;
		}

		const { listItem } = this.props.view.state.schema.nodes;
		return !!findParentNodeOfTypeClosestToPos($pos, [listItem]);
	}

	get insideLayout(): boolean {
		const $pos = this.$pos;
		if (!$pos) {
			return false;
		}

		const { layoutColumn } = this.props.view.state.schema.nodes;

		return !!findParentNodeOfTypeClosestToPos($pos, [layoutColumn]);
	}

	get isGuidelineEnabled(): boolean {
		return !!this.props.pluginInjectionApi?.guideline;
	}

	// check if is inside of layout, table, expand, nestedExpand and list item
	isNestedNode(): boolean {
		const $pos = this.$pos;
		return !!($pos && $pos.depth !== 0);
	}

	// Check if adjacement mode should be activated;
	isAdjacentMode(): boolean {
		if (fg('platform_editor_inline_resize_media_to_edge')) {
			if (this.props.forceHandlePositioning === 'adjacent') {
				return true;
			}
		}

		return this.isNestedNode() ?? false;
	}

	getHandlePositioning(): HandlePositioning | undefined {
		return this.isAdjacentMode() ? 'adjacent' : undefined;
	}

	private getDefaultGuidelines() {
		const { lineLength, containerWidth, fullWidthMode } = this.props;

		// disable guidelines for nested media single node
		return this.isAdjacentMode()
			? []
			: generateDefaultGuidelines(lineLength, containerWidth || 0, fullWidthMode);
	}

	private updateGuidelines = () => {
		const { view, lineLength } = this.props;
		const defaultGuidelines = this.getDefaultGuidelines();

		const { relativeGuides, dynamicGuides } = generateDynamicGuidelines(view.state, lineLength, {
			styles: {
				lineStyle: 'dashed',
			},
			show: false,
		});

		// disable guidelines for nested media single node
		const dynamicGuidelines = this.isAdjacentMode() ? [] : dynamicGuides;

		this.setState({
			relativeGuides,
			guidelines: [...defaultGuidelines, ...dynamicGuidelines],
		});
	};

	async checkVideoFile(viewMediaClientConfig?: MediaClientConfig) {
		if (this.pos === null || !viewMediaClientConfig) {
			return;
		}

		const mediaNode = this.props.view.state.doc.nodeAt(this.pos + 1);
		const mediaType = mediaNode
			? await checkMediaType(mediaNode, viewMediaClientConfig)
			: undefined;

		const isVideoFile = mediaType !== 'external' && mediaType !== 'image';

		if (this.state.isVideoFile !== isVideoFile) {
			this.setState({ isVideoFile });
		}
	}

	calcNewLayout = (newWidth: number, stop: boolean) => {
		const { layout, containerWidth, lineLength, fullWidthMode } = this.props;

		const newPct = calcPctFromPx(newWidth, lineLength) * 100;

		if (newPct <= 100 && this.wrappedLayout) {
			if (!stop || newPct !== 100) {
				return layout;
			}
		}
		return this.calcUnwrappedLayout(
			newWidth,
			containerWidth || 0,
			lineLength,
			fullWidthMode,
			this.isAdjacentMode(),
		);
	};

	calcUnwrappedLayout = (
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

		if (
			width <
			Math.min(containerWidth - akEditorGutterPaddingDynamic() * 2, akEditorFullWidthLayoutWidth)
		) {
			return 'wide';
		}

		// set full width to be containerWidth - akEditorGutterPaddingDynamic() * 2
		// instead of containerWidth - akEditorBreakoutPadding,
		// so that we have image aligned with text
		return 'full-width';
	};

	calcPxHeight = (newWidth: number): number => {
		const { width = newWidth, height } = this.props;
		return Math.round((height / width) * newWidth);
	};

	private displayGuideline = (guidelines: GuidelineConfig[]) =>
		this.props.pluginInjectionApi?.guideline?.actions?.displayGuideline(this.props.view)({
			guidelines,
		});

	private setIsResizing = (isResizing: boolean) => {
		const { state, dispatch } = this.props.view;
		const tr = state.tr;
		tr.setMeta(MEDIA_PLUGIN_IS_RESIZING_KEY, isResizing);
		tr.setMeta('is-resizer-resizing', isResizing);
		return dispatch(tr);
	};

	private updateSizeInPluginState = throttle((width?: number) => {
		const { state, dispatch } = this.props.view;
		const tr = state.tr;
		tr.setMeta(MEDIA_PLUGIN_RESIZING_WIDTH_KEY, width);
		return dispatch(tr);
	}, MEDIA_SINGLE_RESIZE_THROTTLE_TIME);

	private calcMaxWidth = memoizeOne(
		(contentWidth: number, containerWidth: number, fullWidthMode?: boolean) => {
			if (this.isAdjacentMode() || fullWidthMode) {
				return contentWidth;
			}

			return calcMediaSingleMaxWidth(containerWidth, this.props.editorAppearance);
		},
	);

	private calcMinWidth = memoizeOne((isVideoFile: boolean, contentWidth?: number) => {
		return Math.min(
			contentWidth || akEditorDefaultLayoutWidth,
			isVideoFile ? MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH : MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
		);
	});

	private getRelativeGuides = () => {
		const guidelinePluginState =
			this.props.pluginInjectionApi?.guideline?.sharedState?.currentState();
		const { top: topOffset } = guidelinePluginState?.rect || {
			top: 0,
			left: 0,
		};
		const $pos = this.$pos;
		const relativeGuides: GuidelineConfig[] =
			$pos && $pos.nodeAfter && this.state.size.width
				? getRelativeGuidelines(
						this.state.relativeGuides,
						{
							node: $pos.nodeAfter,
							pos: $pos.pos,
						},
						this.props.view,
						this.props.lineLength,
						topOffset,
						this.state.size,
					)
				: [];

		return relativeGuides;
	};

	updateActiveGuidelines = (
		width = 0,
		guidelines: GuidelineConfig[],
		guidelineSnapsReference: GuidelineSnapsReference,
	) => {
		if (guidelineSnapsReference.snaps.x) {
			const { gap, keys: activeGuidelineKeys } = findClosestSnap(
				width,
				guidelineSnapsReference.snaps.x,
				guidelineSnapsReference.guidelineReference,
				MEDIA_SINGLE_SNAP_GAP,
			);

			const relativeGuidelines = activeGuidelineKeys.length ? [] : this.getRelativeGuides();

			this.lastSnappedGuidelineKeys = activeGuidelineKeys.length
				? activeGuidelineKeys
				: relativeGuidelines.map((rg) => rg.key);

			this.displayGuideline([
				...getGuidelinesWithHighlights(gap, MEDIA_SINGLE_SNAP_GAP, activeGuidelineKeys, guidelines),
				...relativeGuidelines,
			]);
		}
	};

	calculateSizeState = (
		size: Position & Dimensions,
		delta: Dimensions,
		onResizeStop: boolean = false,
	) => {
		const calculatedWidth = Math.round(size.width + delta.width);
		const calculatedWidthWithLayout = this.calcNewLayout(calculatedWidth, onResizeStop);

		return {
			width: calculatedWidth,
			height: calculatedWidth / this.aspectRatio,
			layout: calculatedWidthWithLayout,
		};
	};

	selectCurrentMediaNode = () => {
		// TODO: ED-26962 - if adding !this.props.selected, it doesn't work if media single node is at top postion
		if (this.pos === null) {
			return;
		}

		setNodeSelection(this.props.view, this.pos);
	};

	handleResizeStart: HandleResizeStart = () => {
		this.setState({ isResizing: true });
		this.selectCurrentMediaNode();
		this.setIsResizing(true);
		this.updateSizeInPluginState(this.state.size.width);
		// re-calculate guidelines
		if (this.isGuidelineEnabled) {
			this.updateGuidelines();
		}
	};

	handleResize: HandleResize = (size, delta) => {
		const { layout, updateSize, lineLength } = this.props;
		const { width, height, layout: newLayout } = this.calculateSizeState(size, delta);

		if (this.isGuidelineEnabled) {
			const guidelineSnaps = getGuidelineSnaps(this.state.guidelines, lineLength, layout);

			this.updateActiveGuidelines(width, this.state.guidelines, guidelineSnaps);

			const relativeSnaps = getRelativeGuideSnaps(this.state.relativeGuides, this.aspectRatio);

			this.setState({
				size: {
					width,
					height,
				},
				snaps: {
					x: [...(guidelineSnaps.snaps.x || []), ...relativeSnaps],
				},
			});
		} else {
			this.setState({
				size: {
					width,
					height,
				},
			});
		}

		this.updateSizeInPluginState(width);

		if (newLayout !== layout) {
			updateSize(width, newLayout);
		}
	};

	handleResizeStop: HandleResize = (size, delta) => {
		const { updateSize, dispatchAnalyticsEvent, nodeType } = this.props;
		const { width, height, layout: newLayout } = this.calculateSizeState(size, delta, true);

		if (dispatchAnalyticsEvent) {
			const $pos = this.$pos;
			const event = getMediaResizeAnalyticsEvent(nodeType || 'mediaSingle', {
				width,
				layout: newLayout,
				widthType: 'pixel',
				snapType: getGuidelineTypeFromKey(this.lastSnappedGuidelineKeys, this.state.guidelines),
				parentNode: $pos ? $pos.parent.type.name : undefined,
				inputMethod: 'mouse',
			});
			if (event) {
				dispatchAnalyticsEvent(event);
			}
		}

		this.setIsResizing(false);
		this.displayGuideline([]);

		let newWidth = width;
		if (newLayout === 'full-width') {
			// When a node reaches full width in current viewport,
			// update its width with 1800 to align with pixel entry
			newWidth = akEditorFullWidthLayoutWidth;
		}

		this.setState(
			{
				isResizing: false,
				size: {
					width: newWidth,
					height,
				},
			},
			() => {
				updateSize(newWidth, newLayout);
			},
		);
	};

	getMaxWidth = () => {
		const { lineLength, containerWidth, fullWidthMode, editorAppearance, forceHandlePositioning } =
			this.props;
		const { isResizing } = this.state;

		if (
			editorAppearance === 'chromeless' &&
			forceHandlePositioning === 'adjacent' &&
			fg('platform_editor_inline_resize_media_to_edge')
		) {
			return containerWidth - MEDIA_SINGLE_ADJACENT_HANDLE_MARGIN * 2;
		}

		return !isResizing && this.isAdjacentMode()
			? // set undefined to fall back to 100%
				undefined
			: this.calcMaxWidth(lineLength, containerWidth, fullWidthMode);
	};

	render() {
		const {
			width: origWidth,
			layout,
			containerWidth,
			fullWidthMode,
			selected,
			children,
			lineLength,
			showLegacyNotification,
		} = this.props;

		const { isResizing, size, isVideoFile } = this.state;

		const enable: EnabledHandles = {};
		handleSides.forEach((side) => {
			const oppositeSide = side === 'left' ? 'right' : 'left';
			enable[side] =
				nonWrappedLayouts
					.concat(`wrap-${oppositeSide}` as MediaSingleLayout)
					.concat(`align-${imageAlignmentMap[oppositeSide]}` as MediaSingleLayout)
					.indexOf(layout) > -1;

			if (side === 'left' && this.insideInlineLike) {
				enable[side] = false;
			}
		});

		// TODO: ED-26962 - Clean up where this lives and how it gets generated
		const className = classnames(
			richMediaClassName,
			`image-${layout}`,
			isResizing ? 'is-resizing' : 'not-resizing',
			this.props.className,
			{
				'richMedia-selected': selected,
				'rich-media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
			},
		);
		const resizerNextClassName = classnames(className, resizerStyles as unknown as Mapping);
		const isNestedNode = this.isAdjacentMode();
		const handlePositioning = this.getHandlePositioning();

		const maxWidth = this.getMaxWidth();

		const minWidth = this.calcMinWidth(isVideoFile, lineLength);

		// while is not resizing, we take 100% as min-width if the container width is less than the min-width
		const minViewWidth = isResizing ? minWidth : `min(${minWidth}px, 100%)`;

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={wrapperStyle({
					layout,
					containerWidth: containerWidth || origWidth,
					fullWidthMode,
					mediaSingleWidth: this.state.size.width,
					isNestedNode,
					isExtendedResizeExperienceOn: true,
				})}
			>
				<ResizerNext
					minWidth={minViewWidth}
					maxWidth={maxWidth}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={resizerNextClassName}
					snapGap={MEDIA_SINGLE_SNAP_GAP}
					enable={enable}
					width={size.width}
					handleResizeStart={this.handleResizeStart}
					handleResize={this.handleResize}
					handleResizeStop={this.handleResizeStop}
					snap={this.state.snaps}
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
	}
}

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

	if (
		width <
		Math.min(containerWidth - akEditorGutterPaddingDynamic() * 2, akEditorFullWidthLayoutWidth)
	) {
		return 'wide';
	}

	// set full width to be containerWidth - akEditorGutterPaddingDynamic() * 2
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
	const [isVideoFile, setIsVideoFile] = useState<boolean>(true);

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
		if (fg('platform_editor_inline_resize_media_to_edge')) {
			if (forceHandlePositioning === 'adjacent') {
				return true;
			}
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
		if (
			editorAppearance === 'chromeless' &&
			forceHandlePositioning === 'adjacent' &&
			fg('platform_editor_inline_resize_media_to_edge')
		) {
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
	if (fg('platform_editor_react18_phase2__media_single')) {
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
	}

	return (
		<ResizableMediaSingleNext
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
