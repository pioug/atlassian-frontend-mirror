import React from 'react';
import { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { MediaSingleLayout } from '@atlaskit/adf-schema';
import {
  akEditorFullPageMaxWidth,
  akEditorFullWidthLayoutWidth,
} from '../../styles';
import { calcWideWidth, calcBreakoutWidth } from '../../utils/breakout';

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
      return width > akEditorFullPageMaxWidth / 2
        ? 'calc(50% - 12px)'
        : `${width}px`;
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
      return '12px auto 12px 24px';
    case 'wrap-left':
      return '12px 24px 12px auto';
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

export interface WrapperProps {
  layout: MediaSingleLayout;
  width?: number;
  ratio: string;
  containerWidth?: number;
  pctWidth?: number;
  innerRef?: (elem: HTMLElement) => void;
  fullWidthMode?: boolean;
  isResized?: boolean;
}

/**
 * Can't use `.attrs` to handle highly dynamic styles because we are still
 * supporting `styled-components` v1.
 */
export const MediaSingleDimensionHelper = ({
  width,
  layout,
  containerWidth = 0,
  pctWidth,
  fullWidthMode,
  isResized,
}: WrapperProps) => css`
  tr & {
    max-width: 100%;
  }
  width: ${pctWidth
    ? calcResizedWidth(layout, width || 0, containerWidth)
    : calcLegacyWidth(
        layout,
        width || 0,
        containerWidth,
        fullWidthMode,
        isResized,
      )};
  max-width: ${calcMaxWidth(layout, containerWidth)};
  float: ${float(layout)};
  margin: ${calcMargin(layout)};
  ${isImageAligned(layout)};

  &:not(.is-resizing) {
    transition: width 100ms ease-in;
  }
`;

const Wrapper: React.ComponentClass<HTMLAttributes<{}> &
  WrapperProps> = styled.div`
  ${MediaSingleDimensionHelper};
  position: relative;

  &::after {
    content: '';
    display: block;
    padding-bottom: ${p => p.ratio}%;

    /* Fixes extra padding problem in Firefox */
    font-size: 0;
    line-height: 0;
  }

  /* Editor */
  & > div {
    position: absolute;
    height: 100%;
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

Wrapper.displayName = 'WrapperMediaSingle';

export default Wrapper;
