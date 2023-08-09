import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
} from '@atlaskit/editor-shared-styles';

import { getMediaSinglePixelWidth, roundToNearest } from '../media-single';

import { Position, VerticalPosition } from './types';

export const isNumber = (x: unknown): x is number =>
  typeof x === 'number' && !isNaN(x) && isFinite(x);

export const isVerticalPosition = (pos: Position): pos is VerticalPosition =>
  isNumber(pos.x);

/**
 * Calculates container or full editor width taking in account editor full width layout
 * width and editor gutter padding.
 */
export const getContainerWidthOrFullEditorWidth = (containerWidth: number) =>
  Math.min(
    containerWidth - akEditorGutterPadding * 2,
    akEditorFullWidthLayoutWidth,
  ) / 2;

/**
 *
 * @param mediaSingle the mediaSingle node
 * @param editorWidth default 760, only use default if the mediaSingle is using pixel width
 * @returns null or dimensions info
 */
export const getMediaSingleDimensions = (
  mediaSingle: PMNode,
  editorWidth: number = akEditorDefaultLayoutWidth,
): {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  ratio: number;
} | null => {
  if (mediaSingle.type !== mediaSingle.type.schema.nodes.mediaSingle) {
    return null;
  }

  const mediaNode = mediaSingle.firstChild;
  const { width, height } = mediaNode?.attrs || {};

  // e.g. external image
  if (!width || !height) {
    return null;
  }

  const ratio = parseFloat((height / width).toFixed(2));

  if (!mediaSingle.attrs.width) {
    return {
      width,
      height,
      originalWidth: width,
      originalHeight: height,
      ratio,
    };
  }

  const pixelWidth = getMediaSinglePixelWidth(
    mediaSingle.attrs.width,
    editorWidth,
    mediaSingle.attrs.widthType,
  );

  return {
    width: roundToNearest(pixelWidth),
    height: roundToNearest(pixelWidth * ratio),
    originalWidth: width,
    originalHeight: height,
    ratio,
  };
};
