/** @jsx jsx */
import type { RefObject } from 'react';
import React from 'react';

import { css, jsx } from '@emotion/react';

import type { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import {
  akEditorFullPageMaxWidth,
  akEditorFullWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';

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

function getWidthIfFullWidthMode(width: number): string {
  return width > akEditorFullWidthLayoutWidth ? '100%' : `${width}px`;
}

function getWidthIfDefaultMode(width: number): string {
  return width > akEditorFullPageMaxWidth ? '100%' : `${width}px`;
}

/**
 * Calculates the image width for non-resized images.
 *
 * If an image has not been resized using the pctWidth attribute,
 * then an image in wide or full-width can not be wider than the image's
 * original width.
 */
export function calcLegacyWidth(
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
      return calcWideWidth(containerWidth);
    case 'full-width':
      return calcBreakoutWidth(layout, containerWidth);
    default:
      return isResized
        ? `${width}px`
        : fullWidthMode
        ? getWidthIfFullWidthMode(width)
        : getWidthIfDefaultMode(width);
  }
}

/**
 * Calculates the image width for previously resized images.
 *
 * Wide and full-width images are always that size (960px and 100%); there is
 * no distinction between max-width and width.
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

export interface MediaSingleWrapperProps {
  containerWidth?: number;
  fullWidthMode?: boolean;
  isResized?: boolean;
  layout: MediaSingleLayout;
  /**
   * @private
   * @deprecated Use {@link MediaSingleWrapperProps["mediaSingleWidth"]} instead.
   * Cleanup ticket: https://product-fabric.atlassian.net/browse/ED-19076
   */
  pctWidth?: number;
  mediaSingleWidth?: number;
  width?: number;
  innerRef?: ((elem: HTMLDivElement) => void) | RefObject<HTMLDivElement>;
  isExtendedResizeExperienceOn?: boolean;
  isNestedNode?: boolean;
}

/**
 * Can't use `.attrs` to handle highly dynamic styles because we are still
 * supporting `styled-components` v1.
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
}: MediaSingleWrapperProps) => css`
  /* For nested rich media items, set max-width to 100% */
  tr &,
  [data-layout-column] &,
  [data-node-type='expand'] &,
  li & {
    max-width: 100%;
  }

  width: ${isExtendedResizeExperienceOn
    ? `${mediaSingleWidth || width}px`
    : mediaSingleWidth
    ? calcResizedWidth(layout, width || 0, containerWidth)
    : calcLegacyWidth(
        layout,
        width || 0,
        containerWidth,
        fullWidthMode,
        isResized,
      )};
  ${layout === 'full-width' &&
  /* This causes issues for new experience where we don't strip layout attributes
   when copying top-level node and pasting into a table/layout,
   because full-width layout will remain, causing node to be edge-to-edge */
  !isExtendedResizeExperienceOn &&
  css`
    min-width: 100%;
  `}
  max-width: ${isExtendedResizeExperienceOn
    ? `${containerWidth}px`
    : calcMaxWidth(layout, containerWidth)};

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

  &[class*='not-resizing'] {
    ${isNestedNode
      ? /* Make nested node appear responsives when resizing table cell */
        `max-width: 100%;`
      : `${
          nonWrappedLayouts.includes(layout) &&
          `margin-left: 50%;
          transform: translateX(-50%);`
        }`}
  }

  float: ${float(layout)};
  margin: ${calcMargin(layout)};
  ${isImageAligned(layout)};

  &:not(.is-resizing) {
    transition: width 100ms ease-in;
  }
`;

export interface MediaWrapperProps {
  paddingBottom?: string;
  height?: number;
  hasFallbackContainer?: boolean;
}

const RenderFallbackContainer = ({
  hasFallbackContainer,
  paddingBottom,
  height,
}: MediaWrapperProps) => css`
  ${hasFallbackContainer
    ? `
  &::after {
    content: '';
    display: block;
    ${
      height
        ? `height: ${height}px;`
        : paddingBottom
        ? `padding-bottom: ${paddingBottom};`
        : ''
    }

    /* Fixes extra padding problem in Firefox */
    font-size: 0;
    line-height: 0;
  }
  `
    : ''}
`;

export const mediaWrapperStyle = (props: MediaWrapperProps) => css`
  position: relative;

  ${RenderFallbackContainer(props)}

  /* Editor */
  & > figure {
    position: ${props.hasFallbackContainer ? 'absolute' : 'relative'};
    height: 100%;
    width: 100%;
  }

  & > div {
    position: ${props.hasFallbackContainer ? 'absolute' : 'relative'};
    height: 100%;
    width: 100%;
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

export const MediaBorderGapFiller: React.FC<MediaBorderGapFillerProps> = ({
  borderColor,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '0px',
        border: `0.5px solid ${borderColor}`,
        borderRadius: '1px',
      }}
    />
  );
};
