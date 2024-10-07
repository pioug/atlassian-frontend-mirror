import { mediaSingleSpec } from '@atlaskit/adf-schema';
import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema/schema';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { DOMOutputSpec, NodeSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { N20, N50 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { getAttrsFromNodeMediaSingle } from './toDOMAttrs';

const WRAPPED_LAYOUTS = ['wrap-left', 'wrap-right'];
const ALIGNED_LAYOUTS = ['align-end', 'align-start'];
const LEGACY_LAYOUTS = ['full-width', 'wide'];

const DEFAULT_IMAGE_WIDTH = 250;
const DEFAULT_IMAGE_HEIGHT = 200;

const GUTTER_SIZE = '24px';
const HALF_GUTTER_SIZE = '12px';

type MediaWidthCSSCalcProps = {
	layout: MediaSingleLayout;
	mediaSingleDimensionWidth: number | undefined;
	baseWidth: number | undefined;
	isPixelWidth: boolean;
	isExtendedResizeExperience: boolean;
};

export const mediaWidthCSSCalc = ({
	mediaSingleDimensionWidth,
	layout,
	baseWidth,
	isPixelWidth,
	isExtendedResizeExperience,
}: MediaWidthCSSCalcProps): string => {
	const hasMediaDimensionWidth = typeof mediaSingleDimensionWidth === 'number';
	const isMediaWrapped = WRAPPED_LAYOUTS.includes(layout);
	const isMediaAligned = ALIGNED_LAYOUTS.includes(layout);
	const isMediaLegacyLayout = LEGACY_LAYOUTS.includes(layout);

	const shouldUseAlignedLayoutCalc = isMediaAligned && !hasMediaDimensionWidth;
	const shouldUseWrappedLayoutCalc = isMediaWrapped && !hasMediaDimensionWidth;
	const shouldUseBreakoutWideLogic = layout === 'wide';
	const shouldUseBreakoutFullWidthLogic = layout === 'full-width';

	const shouldUseProportionalCalc =
		!isExtendedResizeExperience &&
		!isPixelWidth &&
		hasMediaDimensionWidth &&
		!isMediaLegacyLayout &&
		!isMediaWrapped;
	const shouldUseHalfContainerCalc =
		shouldUseProportionalCalc && isMediaAligned && mediaSingleDimensionWidth >= 100;
	const shouldHardCodePixelWidth =
		isExtendedResizeExperience && isPixelWidth && hasMediaDimensionWidth;

	const containerWidthPlusGutter = `(min(100cqw, 100%) + ${GUTTER_SIZE})`;
	const fullContainerWidth = 'var(--ak-editor-max-container-width, 100cqw)';

	const applyContainerWidthBoundaries = (calc: string) => {
		// Safe measure to avoid bleeding
		return `min(${calc}, ${fullContainerWidth})`;
	};

	let cssCalc = '';
	if (shouldUseAlignedLayoutCalc) {
		cssCalc = `min(calc(${containerWidthPlusGutter} * 0.5 - ${GUTTER_SIZE}), ${baseWidth}px)`;
	} else if (shouldUseWrappedLayoutCalc) {
		cssCalc = `100%`;
	} else if (shouldUseHalfContainerCalc) {
		cssCalc = `min(min(${baseWidth}px, calc(50cqw - ${HALF_GUTTER_SIZE})), 100%)`;
	} else if (shouldUseProportionalCalc) {
		cssCalc = `calc(${containerWidthPlusGutter} * var(--ak-editor-media-single--proportion, 1px) - ${GUTTER_SIZE})`;
	} else if (shouldHardCodePixelWidth) {
		cssCalc = `min(${mediaSingleDimensionWidth}px, ${fullContainerWidth})`;
	} else if (shouldUseBreakoutWideLogic) {
		cssCalc = `max(var(--ak-editor--line-length), min(var(--ak-editor--breakout-wide-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
	} else if (shouldUseBreakoutFullWidthLogic) {
		cssCalc = `max(var(--ak-editor--line-length), min(var(--ak-editor--full-width-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
	} else {
		cssCalc = `max(min(${baseWidth}px, min(100cqw, 100%)), ${GUTTER_SIZE})`;
	}

	return applyContainerWidthBoundaries(cssCalc);
};

type MediaContentWrapperWidthCSSCalcProps = {
	isMediaWrapped: boolean;
	isExternalMedia: boolean;
	isPixelWidth: boolean;
	childMediaWidth: number | undefined;
	mediaSingleDimensionWidth: number | undefined;
};
export const mediaContentWrapperWidthCSSCalc = ({
	isMediaWrapped,
	isExternalMedia,
	isPixelWidth,
	childMediaWidth,
	mediaSingleDimensionWidth,
}: MediaContentWrapperWidthCSSCalcProps) => {
	if (isExternalMedia || !isMediaWrapped) {
		return 'unset';
	}

	const hasMediaDimensionWidth = typeof mediaSingleDimensionWidth === 'number';

	if (!hasMediaDimensionWidth) {
		return `calc((100% / 2) - ${HALF_GUTTER_SIZE})`;
	}
	if (isPixelWidth) {
		return `min(calc((var(--ak-editor-max-container-width, 100%) / 2) - ${HALF_GUTTER_SIZE}), ${mediaSingleDimensionWidth}px)`;
	}

	const hasChildMediaWidth = typeof childMediaWidth === 'number';
	if (hasChildMediaWidth) {
		return `min(calc(100% * (${mediaSingleDimensionWidth} / 100) - ${HALF_GUTTER_SIZE}), ${childMediaWidth}px)`;
	}

	return `calc(100% * (${mediaSingleDimensionWidth} / 100) - ${HALF_GUTTER_SIZE})`;
};

type MediaProportionalWidthCSSCalcProps = {
	isPixelWidth: boolean;
	isExtendedResizeExperience: boolean;
	isMediaWrapped: boolean;
	mediaSingleDimensionWidth: number | undefined;
};
export const mediaProportionalWidthCSSCalc = ({
	isPixelWidth,
	isExtendedResizeExperience,
	mediaSingleDimensionWidth,
	isMediaWrapped,
}: MediaProportionalWidthCSSCalcProps): string => {
	const hasMediaWidth = typeof mediaSingleDimensionWidth === 'number';

	if (isPixelWidth || isExtendedResizeExperience || !hasMediaWidth) {
		return 'unset';
	}

	if (isMediaWrapped) {
		return mediaSingleDimensionWidth >= 50 ? '1' : `${1 - mediaSingleDimensionWidth / 100}`;
	}

	return `${mediaSingleDimensionWidth / 100}`;
};

type MediaJustifyContentCSSProps = {
	layout: MediaSingleLayout;
};
export const mediaJustifyContentCSS = ({ layout }: MediaJustifyContentCSSProps): string => {
	switch (layout) {
		case 'align-end':
		case 'wrap-right':
			return 'end';
		case 'align-start':
		case 'wrap-left':
			return 'start';
		default:
			return 'center';
	}
};

type PrepareWrapperContentDOMProps = {
	layout: MediaSingleLayout;
	dataAttrs: Record<string, unknown>;
	childMediaWidth: number;
	childMediaHeight: number;
	mediaSingleDimensionWidth: number;
	isPixelWidth: boolean;
	isExtendedResizeExperience: boolean;
};
export const prepareWrapperContentDOM = ({
	layout,
	dataAttrs,
	childMediaWidth,
	childMediaHeight,
	mediaSingleDimensionWidth,
	isPixelWidth,
	isExtendedResizeExperience,
}: PrepareWrapperContentDOMProps): DOMOutputSpec => {
	const layoutStyleJustifyContent = mediaJustifyContentCSS({ layout });
	const mediaWidthCalc = mediaWidthCSSCalc({
		layout,
		mediaSingleDimensionWidth,
		baseWidth: childMediaWidth,
		isPixelWidth,
		isExtendedResizeExperience,
	});

	const paddingBottom = `calc((${childMediaHeight} / ${childMediaWidth}) * 100%)`;

	return [
		'div',
		{
			class: `rich-media-item mediaSingleView-content-wrap image-${layout}`,
			style: convertToInlineCss({
				display: 'flex',
				justifyContent: layoutStyleJustifyContent,
				transform: 'unset',
				marginLeft: '0',
			}),
			...dataAttrs,
		},
		[
			'div',
			{
				style: convertToInlineCss({
					borderRadius: token('border.radius', '3px'),
					width: mediaWidthCalc,
					minWidth: mediaWidthCalc,
					color: token('color.icon', N50),
				}),
			},
			[
				'figure',
				{
					class: 'media-single-node',
					style: convertToInlineCss({
						'--ak-editor-media-padding-bottom': paddingBottom,
						margin: '0px',
					}),
				},
				[
					'div',
					{},
					[
						'div',
						{
							class: 'media-content-wrap',
						},
						0,
					],
				],
			],
		],
	];
};

export const toDOM = (node: PMNode): DOMOutputSpec => {
	const mediaSingleAttrs = node.attrs;
	const isPixelWidth = mediaSingleAttrs?.widthType === 'pixel';
	const layout: MediaSingleLayout = mediaSingleAttrs?.layout ?? 'center';
	const childNode = node.firstChild;
	const isExternalMedia = childNode?.attrs.type === 'external';

	const childMediaWidth = childNode?.attrs.width || DEFAULT_IMAGE_WIDTH;
	const childMediaHeight = childNode?.attrs.height || DEFAULT_IMAGE_HEIGHT;

	const dataAttrs = getAttrsFromNodeMediaSingle(
		fg('platform.editor.media.extended-resize-experience'),
		node,
	);

	const content = prepareWrapperContentDOM({
		layout,
		dataAttrs,
		childMediaWidth,
		childMediaHeight,
		mediaSingleDimensionWidth: mediaSingleAttrs.width,
		isPixelWidth,
		isExtendedResizeExperience: fg('platform.editor.media.extended-resize-experience'),
	});

	const isMediaWrapped = WRAPPED_LAYOUTS.includes(layout);
	const proportionCalc = mediaProportionalWidthCSSCalc({
		isPixelWidth,
		isMediaWrapped,
		mediaSingleDimensionWidth: mediaSingleAttrs?.width,
		isExtendedResizeExperience: fg('platform.editor.media.extended-resize-experience'),
	});
	const contentWrapperWidth = mediaContentWrapperWidthCSSCalc({
		isMediaWrapped,
		isExternalMedia,
		isPixelWidth,
		childMediaWidth,
		mediaSingleDimensionWidth: mediaSingleAttrs?.width,
	});

	return [
		'div',
		{
			class: 'mediaSingleView-content-wrap',
			layout,
			style: convertToInlineCss({
				'--ak-editor-media-single--proportion': proportionCalc,
				'--ak-editor-media-card-display': 'block',
				'--ak-editor-media-single--gutter-size': GUTTER_SIZE,
				'--ak-editor-media-margin-right': '0',
				'--ak-editor-media-card-background-color': token('color.background.neutral', N20),
				marginTop: isMediaWrapped ? HALF_GUTTER_SIZE : token('space.300', '24px'),
				marginBottom: isMediaWrapped ? HALF_GUTTER_SIZE : token('space.300', '24px'),
				marginRight: isMediaWrapped ? (layout === 'wrap-right' ? 'auto' : HALF_GUTTER_SIZE) : 0,
				marginLeft: isMediaWrapped ? (layout === 'wrap-left' ? 'auto' : HALF_GUTTER_SIZE) : 0,
				width: contentWrapperWidth,
			}),
		},
		content,
	];
};

// @nodeSpecException:toDOM patch
export const mediaSingleSpecWithFixedToDOM = (mediaSingleOption: {
	withCaption?: boolean;
	withExtendedWidthTypes: boolean;
}): NodeSpec => {
	const mediaSingleNode = mediaSingleSpec(mediaSingleOption);
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return mediaSingleNode;
	}

	return {
		...mediaSingleNode,
		toDOM,
	};
};
