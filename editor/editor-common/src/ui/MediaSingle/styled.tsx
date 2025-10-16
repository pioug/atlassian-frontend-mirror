/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { RefObject } from 'react';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullPageMaxWidth,
	akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';

import { isSSR } from '../../core-utils/is-ssr';
import { nonWrappedLayouts } from '../../utils';
import { calcBreakoutWidth, calcWideWidth } from '../../utils/breakout';

function float(layout: MediaSingleLayout): string {
	switch (layout) {
		case 'wrap-right':
			return 'right';
		case 'wrap-left':
			return 'left';
		default:
			return 'none';
	}
}

function getWidthIfFullWidthMode(
	originalWidth: number,
	containerWidth: number,
	isInsideOfInlineExtension?: boolean,
): string {
	if (isInsideOfInlineExtension) {
		return originalWidth > akEditorFullWidthLayoutWidth
			? `${Math.min(containerWidth, akEditorFullWidthLayoutWidth)}px`
			: `${originalWidth}px`;
	}
	return originalWidth > akEditorFullWidthLayoutWidth ? '100%' : `${originalWidth}px`;
}

function getWidthIfDefaultMode(
	originalWidth: number,
	containerWidth: number,
	isInsideOfInlineExtension?: boolean,
): string {
	if (isInsideOfInlineExtension) {
		return originalWidth > akEditorFullPageMaxWidth
			? `${Math.min(containerWidth, akEditorDefaultLayoutWidth)}px`
			: `${originalWidth}px`;
	}
	return originalWidth > akEditorFullPageMaxWidth ? '100%' : `${originalWidth}px`;
}

/**
 * Calculates the image width for non-resized images.
 *
 * If an image has not been resized using the pctWidth attribute,
 * then an image in wide or full-width can not be wider than the image's
 * original width.
 * @param layout
 * @param width
 * @param containerWidth
 * @param fullWidthMode
 * @param isResized
 * @param isInsideOfInlineExtension
 * @example
 */
export function calcLegacyWidth(
	layout: MediaSingleLayout,
	width: number,
	containerWidth: number = 0,
	fullWidthMode?: boolean,
	isResized?: boolean,
	isInsideOfInlineExtension?: boolean,
): string {
	switch (layout) {
		case 'align-start':
		case 'align-end':
		case 'wrap-right':
		case 'wrap-left':
			return width > containerWidth / 2 ? 'calc(50% - 12px)' : `${width}px`;
		case 'wide':
			return isInsideOfInlineExtension
				? calcWideWidth(containerWidth, Infinity, `${containerWidth}px`)
				: calcWideWidth(containerWidth);
		case 'full-width':
			return calcBreakoutWidth(layout, containerWidth);
		default:
			return isResized
				? `${width}px`
				: fullWidthMode
					? getWidthIfFullWidthMode(width, containerWidth, isInsideOfInlineExtension)
					: getWidthIfDefaultMode(width, containerWidth, isInsideOfInlineExtension);
	}
}

/**
 * Calculates the image width for non-resized images.
 *
 * If an image has not been resized using the pctWidth attribute,
 * then an image in wide or full-width can not be wider than the image's
 * original width.
 * @param layout
 * @param width
 * @param containerWidth
 * @param fullWidthMode
 * @param isResized
 * @example
 */
export function calcLegacyWidthForInline(
	layout: MediaSingleLayout,
	width: number,
	containerWidth: number = 0,
	fullWidthMode?: boolean,
	isResized?: boolean,
): string {
	switch (layout) {
		case 'align-start':
		case 'align-end':
		case 'wrap-right':
		case 'wrap-left':
			return width > containerWidth / 2 ? 'calc(50% - 12px)' : `${width}px`;
		case 'wide':
			return calcWideWidth(containerWidth, Infinity, `${containerWidth}px`);
		case 'full-width':
			return calcBreakoutWidth(layout, containerWidth);
		default:
			return isResized
				? `${width}px`
				: fullWidthMode
					? getWidthIfFullWidthMode(width, containerWidth)
					: getWidthIfDefaultMode(width, containerWidth);
	}
}

/**
 * Calculates the image width for previously resized images.
 *
 * Wide and full-width images are always that size (960px and 100%); there is
 * no distinction between max-width and width.
 * @param layout
 * @param width
 * @param containerWidth
 * @example
 */
export function calcResizedWidth(
	layout: MediaSingleLayout,
	width: number,
	containerWidth: number = 0,
) {
	switch (layout) {
		case 'wide':
			return calcWideWidth(containerWidth);
		case 'full-width':
			return calcBreakoutWidth(layout, containerWidth);
		default:
			return `${width}px`;
	}
}

function calcMaxWidth(layout: MediaSingleLayout, containerWidth: number) {
	switch (layout) {
		case 'wide':
			return calcWideWidth(containerWidth);
		case 'full-width':
			return calcBreakoutWidth(layout, containerWidth);
		default:
			return '100%';
	}
}

function calcMargin(layout: MediaSingleLayout): string {
	switch (layout) {
		case 'wrap-right':
			return '12px auto 12px 12px';
		case 'wrap-left':
			return '12px 12px 12px auto';
		default:
			return '24px auto';
	}
}

function isImageAligned(layout: MediaSingleLayout): string {
	switch (layout) {
		case 'align-end':
			return 'margin-right: 0';
		case 'align-start':
			return 'margin-left: 0';
		default:
			return '';
	}
}

/**
 * Reduces the given CSS width value to the next lowest even pixel value if the value is in px.
 * This is to mitigate subpixel rendering issues of embedded smart links.
 *
 * @param widthValue CSS width value to be rounded
 * @returns Reduced CSS width value where px value given, or otherwise the original value
 * @example
 */

// widthValue could be a string in px, rem or percentage, e.g. "800px", "100%", etc.
export function roundToClosestEvenPxValue(widthValue: string) {
	try {
		if (widthValue.endsWith('px')) {
			const pxWidth = parseInt(widthValue.slice(0, -2));

			return `${pxWidth - (pxWidth % 2)}px`;
		}

		return widthValue;
	} catch {
		return widthValue;
	}
}

export interface MediaSingleWrapperProps {
	containerWidth?: number;
	fullWidthMode?: boolean;
	innerRef?: ((elem: HTMLDivElement) => void) | RefObject<HTMLDivElement>;
	isExtendedResizeExperienceOn?: boolean;
	isInsideOfInlineExtension?: boolean;
	isNestedNode?: boolean;
	isResized?: boolean;
	layout: MediaSingleLayout;
	mediaSingleWidth?: number;
	nodeType?: string;
	/**
	 * @private
	 * @deprecated Use {@link MediaSingleWrapperProps["mediaSingleWidth"]} instead.
	 * Cleanup ticket: https://product-fabric.atlassian.net/browse/ED-19076
	 */
	pctWidth?: number;
	width?: number;
}

/**
 * Can't use `.attrs` to handle highly dynamic styles because we are still
 * supporting `styled-components` v1.
 * @param root0
 * @param root0.containerWidth
 * @param root0.fullWidthMode
 * @param root0.isResized
 * @param root0.layout
 * @param root0.mediaSingleWidth
 * @param root0.width
 * @param root0.isExtendedResizeExperienceOn
 * @param root0.isNestedNode
 * @param root0.isInsideOfInlineExtension
 * @param root0.nodeType
 * @example
 */
export const MediaSingleDimensionHelper = ({
	containerWidth = 0,
	fullWidthMode,
	isResized,
	layout,
	mediaSingleWidth,
	width, // original media width
	isExtendedResizeExperienceOn,
	isNestedNode = false,
	isInsideOfInlineExtension = false,
	nodeType,
}: MediaSingleWrapperProps) => {
	const calculatedWidth = roundToClosestEvenPxValue(
		isExtendedResizeExperienceOn
			? `${mediaSingleWidth || width}px`
			: mediaSingleWidth
				? calcResizedWidth(layout, width || 0, containerWidth)
				: calcLegacyWidth(
						layout,
						width || 0,
						containerWidth,
						fullWidthMode,
						isResized,
						isInsideOfInlineExtension,
					),
	);

	const calculatedMaxWidth = roundToClosestEvenPxValue(
		isExtendedResizeExperienceOn ? `${containerWidth}px` : calcMaxWidth(layout, containerWidth),
	);

	// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
	return css`
		/* For nested rich media items, set max-width to 100% */
		tr &,
		[data-layout-column] &,
		[data-node-type='expand'] &,
		[data-panel-type] &,
		li & {
			max-width: 100%;
		}

		width: ${calculatedWidth};
		${layout === 'full-width' &&
		/* This causes issues for new experience where we don't strip layout attributes
   when copying top-level node and pasting into a table/layout,
   because full-width layout will remain, causing node to be edge-to-edge */
		!isExtendedResizeExperienceOn &&
		css({
			minWidth: '100%',
		})}

		/* If container doesn't exists, it will fallback to this */
		max-width: ${isSSR() &&
		!calculatedMaxWidth.endsWith('%') &&
		fg('platform_editor_fix_image_size_diff_during_ssr')
			? Math.max(
					parseInt(calculatedWidth.replace('px', '')),
					parseInt(calculatedMaxWidth.replace('px', '')),
				) + 'px'
			: calculatedMaxWidth};
		${isExtendedResizeExperienceOn &&
		`&[class*='is-resizing'] {
    .new-file-experience-wrapper {
      box-shadow: none !important;
    }

    ${
			!isNestedNode &&
			nonWrappedLayouts.includes(layout) &&
			`margin-left: 50%;
      transform: translateX(-50%);`
		}
  }`}

		&:not(.is-resizing) {
			transition: width 100ms ease-in;
		}

		float: ${float(layout)};
		margin: ${calcMargin(layout)};

		&[class*='not-resizing'] {
			${isNestedNode
				? /* Make nested node appear responsive when resizing table cell */
					`max-width: 100%;`
				: nonWrappedLayouts.includes(layout) &&
					`margin-left: 50%;
        transform: translateX(-50%);`}
		}

		${isImageAligned(layout)};
	`;
};

export interface MediaWrapperProps {
	hasFallbackContainer?: boolean;
	height?: number;
	paddingBottom?: string;
}

const RenderFallbackContainer = ({
	hasFallbackContainer,
	paddingBottom,
	height,
}: MediaWrapperProps) =>
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
	css`
		${hasFallbackContainer
			? `
  &::after {
    content: '';
    display: block;
    ${height ? `height: ${height}px;` : paddingBottom ? `padding-bottom: ${paddingBottom};` : ''}

    /* Fixes extra padding problem in Firefox */
    font-size: 0;
    line-height: 0;
  }
  `
			: ''}
	`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const mediaWrapperStyle = (props: MediaWrapperProps) => css`
	position: relative;

	${RenderFallbackContainer(props)}

	/* Editor */
  & > figure {
		position: ${props.hasFallbackContainer ? 'absolute' : 'relative'};
		height: 100%;
		width: 100%;
	}

	/* Comments on media project adds comment badge as child of the media wrapper,
	thus we need to exclude it so that style is applied to intended div */
	& > div:not([data-media-badges='true']) {
		position: ${props.hasFallbackContainer ? 'absolute' : 'relative'};
		height: 100%;
		width: 100%;
	}

	& * [data-mark-annotation-type='inlineComment'] {
		width: 100%;
		height: 100%;
	}

	&[data-node-type='embedCard'] > div {
		width: 100%;
	}

	/* Renderer */
	[data-node-type='media'] {
		position: static !important;

		> div {
			position: absolute;
			height: 100%;
		}
	}
`;

export const MediaWrapper = ({
	children,
	...rest
}: React.HTMLAttributes<HTMLDivElement> & MediaWrapperProps) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<div css={mediaWrapperStyle(rest)}>{children}</div>
);

MediaWrapper.displayName = 'WrapperMediaSingle';

/*
  There was an issue with a small, intermittent white gap appearing between the images due to a small pixel difference in browser rendering.

  The solution implemented below was adapted from: https://stackoverflow.com/a/68885576
  It suggests adding an absolute div on top which matches the width and height and setting the border on that div.
*/

type MediaBorderGapFillerProps = {
	borderColor: string;
};

export const MediaBorderGapFiller = ({ borderColor }: MediaBorderGapFillerProps) => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				position: 'absolute',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				inset: '0px',
				border: `0.5px solid ${borderColor}`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				borderRadius: '1px',
			}}
		/>
	);
};
