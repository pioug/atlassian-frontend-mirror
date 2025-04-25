/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import classnames from 'classnames';

import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import {
	akEditorMediaResizeHandlerPaddingWide,
	DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';

import { MEDIA_SINGLE_GUTTER_SIZE } from '../../media-single/constants';
import { getMediaSinglePixelWidth } from '../../media-single/utils';
import type { EditorAppearance } from '../../types';
import { shouldAddDefaultWrappedWidth } from '../../utils/rich-media-utils';

import { MediaSingleDimensionHelper, MediaWrapper } from './styled';
import type { MediaSingleSize } from './types';
export interface Props {
	children: React.ReactNode;
	layout: MediaSingleLayout;
	width?: number;
	height: number;
	lineLength: number;
	containerWidth?: number;
	isLoading?: boolean;
	className?: string;
	/**
	 * @private
	 * @deprecated Use {@link Props.size.width} instead.
	 * Cleanup ticket: https://product-fabric.atlassian.net/browse/ED-19076
	 */
	pctWidth?: number;
	size?: MediaSingleSize;
	nodeType?: string;
	fullWidthMode?: boolean;
	hasFallbackContainer?: boolean;
	handleMediaSingleRef?: React.RefObject<HTMLDivElement>;
	isInsideOfInlineExtension?: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	dataAttributes?: Record<string, any>;
	editorAppearance?: EditorAppearance;
}

export default function MediaSingle({
	layout,
	width,
	height,
	containerWidth = width,
	isLoading = false,
	pctWidth,
	size,
	className,
	children: propsChildren,
	nodeType = 'mediaSingle',
	fullWidthMode,
	lineLength: editorWidth,
	hasFallbackContainer = true,
	handleMediaSingleRef,
	isInsideOfInlineExtension = false,
	dataAttributes,
}: Props) {
	const isPixelWidth = size?.widthType === 'pixel';

	let mediaSingleWidth = size?.width || pctWidth;

	const children = React.Children.toArray(propsChildren);
	if (!mediaSingleWidth && shouldAddDefaultWrappedWidth(layout, width, editorWidth)) {
		// if width is not available, set to half of editor width
		mediaSingleWidth = isPixelWidth ? editorWidth / 2 : 50;
	}
	// When width is not set we have an absolute height for a given embed.
	// When both width and height are set we use them to determine ratio and use that to define
	// embed height in relation to whatever width of an dom element is in runtime.
	const isHeightOnly = width === undefined;
	if (mediaSingleWidth) {
		const pxWidth = getMediaSinglePixelWidth(
			mediaSingleWidth,
			editorWidth,
			size?.widthType,
			MEDIA_SINGLE_GUTTER_SIZE,
		);
		if (isHeightOnly) {
			width = pxWidth - akEditorMediaResizeHandlerPaddingWide;
		} else if (width !== undefined) {
			height = (height / width) * pxWidth;
			width = pxWidth;
		}
	} else if (isHeightOnly) {
		// No mediaSingleWidth can be found on already existing pages with existing embeds

		// It's ok to use Embed specific width, because width can be not set only in embed card.
		// This value will be used only in the case of non `wide` and non `full-width` cases inside MediaSingleDimensionHelper.
		width = DEFAULT_EMBED_CARD_WIDTH - akEditorMediaResizeHandlerPaddingWide;
	}

	// Media wrapper controls the height of the box.
	// We can define this height
	// - via height directly
	// - via paddingBottom (if we have both height and width) which is a css trick to represent a ratio
	let mediaWrapperHeight: number | undefined;
	let paddingBottom: string | undefined;
	if (isHeightOnly) {
		mediaWrapperHeight = height;
	} else if (width !== undefined) {
		const mediaWrapperRatio = (height / width) * 100;
		paddingBottom = `${mediaWrapperRatio.toFixed(3)}%`;
		if (nodeType === 'embedCard') {
			// we want to set ratio of whole box (including header) buy knowing ratio of iframe itself

			// For some reason importing `embedHeaderHeight` from '@atlaskit/smart-card' breaks
			// packages/editor/editor-core/src/plugins/table/__tests__/unit/toolbar.ts 🤷‍️, but we have a test
			// that uses imported value, so it's should be good.
			paddingBottom = `calc(${paddingBottom} + 32px)`;
		}
	}

	const [media, caption] = children;

	return (
		<div
			ref={handleMediaSingleRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={MediaSingleDimensionHelper({
				width,
				layout,
				containerWidth,
				mediaSingleWidth,
				fullWidthMode,
				isExtendedResizeExperienceOn: isPixelWidth,
				isInsideOfInlineExtension,
			})}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...(fg('platform_fix_media_image_resizing') ? {} : { 'data-layout': layout })}
			data-width={mediaSingleWidth}
			data-width-type={size?.widthType || 'percentage'}
			data-node-type={nodeType}
			data-vc="media-single"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={classnames(
				'rich-media-item mediaSingleView-content-wrap',
				`image-${layout}`,
				className,
				{
					'is-loading': isLoading,
					'rich-media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
				},
			)}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...dataAttributes}
		>
			<MediaWrapper
				hasFallbackContainer={hasFallbackContainer}
				height={mediaWrapperHeight}
				paddingBottom={paddingBottom}
			>
				{media}
			</MediaWrapper>
			{caption}
		</div>
	);
}
