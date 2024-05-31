/** @jsx jsx */
import React from 'react';

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
	MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
	MEDIA_SINGLE_RESIZE_THROTTLE_TIME,
	MEDIA_SINGLE_SNAP_GAP,
	MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH,
} from '@atlaskit/editor-common/media-single';
import type {
	Dimensions,
	HandleResize,
	HandleResizeStart,
	Position,
	Snap,
} from '@atlaskit/editor-common/resizer';
import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { resizerStyles, richMediaClassName } from '@atlaskit/editor-common/styles';
import {
	calcPctFromPx,
	handleSides,
	imageAlignmentMap,
	wrappedLayouts,
} from '@atlaskit/editor-common/ui';
import { nonWrappedLayouts, setNodeSelection } from '@atlaskit/editor-common/utils';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
} from '@atlaskit/editor-shared-styles';
import type { MediaClientConfig } from '@atlaskit/media-core';

import {
	MEDIA_PLUGIN_IS_RESIZING_KEY,
	MEDIA_PLUGIN_RESIZING_WIDTH_KEY,
} from '../../pm-plugins/main';
import { getMediaResizeAnalyticsEvent } from '../../utils/analytics';
import { checkMediaType } from '../../utils/check-media-type';

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

		// TODO handle this case
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

	private getDefaultGuidelines() {
		const { lineLength, containerWidth, fullWidthMode } = this.props;

		// disable guidelines for nested media single node
		return this.isNestedNode()
			? []
			: generateDefaultGuidelines(lineLength, containerWidth, fullWidthMode);
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
		const dynamicGuidelines = this.isNestedNode() ? [] : dynamicGuides;

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
			containerWidth,
			lineLength,
			fullWidthMode,
			this.isNestedNode(),
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
			width < Math.min(containerWidth - akEditorGutterPadding * 2, akEditorFullWidthLayoutWidth)
		) {
			return 'wide';
		}

		// set full width to be containerWidth - akEditorGutterPadding * 2
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
			if (this.isNestedNode() || fullWidthMode) {
				return contentWidth;
			}

			return calcMediaSingleMaxWidth(containerWidth);
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
		// TODO: if adding !this.props.selected, it doesn't work if media single node is at top postion
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

		// TODO: Clean up where this lives and how it gets generated
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
		const isNestedNode = this.isNestedNode();

		const maxWidth =
			!isResizing && isNestedNode
				? // set undefined to fall back to 100%
					undefined
				: this.calcMaxWidth(lineLength, containerWidth, fullWidthMode);

		const minWidth = this.calcMinWidth(isVideoFile, lineLength);

		// while is not resizing, we take 100% as min-width if the container width is less than the min-width
		const minViewWidth = isResizing ? minWidth : `min(${minWidth}px, 100%)`;

		return (
			<div
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
					handlePositioning={isNestedNode ? 'adjacent' : undefined}
					handleHighlight="full-height"
				>
					{children}
					{showLegacyNotification && <ResizableMediaMigrationNotification />}
				</ResizerNext>
			</div>
		);
	}
}

export default ResizableMediaSingleNext;
