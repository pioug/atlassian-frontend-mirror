import type { EditorState } from 'prosemirror-state';

import { RichMediaLayout as MediaSingleLayout } from '@atlaskit/adf-schema';
import {
  akEditorBreakoutPadding,
  breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import { MEDIA_SINGLE_GUTTER_SIZE } from '../../media-single/constants';
import { EditorContainerWidth } from '../../types';

const validWidthModes: MediaSingleLayout[] = [
  'center',
  'wrap-left',
  'wrap-right',
  'align-start',
  'align-end',
];

export const layoutSupportsWidth = (layout: MediaSingleLayout) =>
  validWidthModes.indexOf(layout) > -1;

export function calcPxFromColumns(
  columns: number,
  lineLength: number,
  gridSize: number,
): number {
  const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
  return (maxWidth / gridSize) * columns - MEDIA_SINGLE_GUTTER_SIZE;
}

export function calcColumnsFromPx(
  width: number,
  lineLength: number,
  gridSize: number,
): number {
  const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
  return ((width + MEDIA_SINGLE_GUTTER_SIZE) * gridSize) / maxWidth;
}

export function calcPxFromPct(pct: number, lineLength: number): number {
  const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
  return maxWidth * pct - MEDIA_SINGLE_GUTTER_SIZE;
}

export function calcPctFromPx(width: number, lineLength: number): number {
  const maxWidth = lineLength + MEDIA_SINGLE_GUTTER_SIZE;
  return (width + MEDIA_SINGLE_GUTTER_SIZE) / maxWidth;
}

export const wrappedLayouts: MediaSingleLayout[] = [
  'wrap-left',
  'wrap-right',
  'align-end',
  'align-start',
];

const calcPctWidth = (
  containerWidth: EditorContainerWidth,
  pctWidth?: number,
  origWidth?: number,
  origHeight?: number,
): number | undefined =>
  pctWidth &&
  origWidth &&
  origHeight &&
  Math.ceil(
    calcPxFromPct(
      pctWidth / 100,
      containerWidth.lineLength || containerWidth.width,
    ),
  );

export const calcMediaPxWidth = (opts: {
  origWidth: number;
  origHeight: number;
  state: EditorState;
  containerWidth: EditorContainerWidth;
  layout?: MediaSingleLayout;
  pctWidth?: number;
  pos?: number;
  resizedPctWidth?: number;
  isFullWidthModeEnabled?: boolean;
}): number => {
  const {
    origWidth,
    origHeight,
    layout,
    pctWidth,
    containerWidth,
    resizedPctWidth,
  } = opts;
  const { width, lineLength } = containerWidth;
  const calculatedPctWidth = calcPctWidth(
    containerWidth,
    pctWidth,
    origWidth,
    origHeight,
  );
  const calculatedResizedPctWidth = calcPctWidth(
    containerWidth,
    resizedPctWidth,
    origWidth,
    origHeight,
  );

  if (layout === 'wide') {
    if (lineLength) {
      const wideWidth = Math.ceil(lineLength * breakoutWideScaleRatio);
      return wideWidth > width ? lineLength : wideWidth;
    }
  } else if (layout === 'full-width') {
    return width - akEditorBreakoutPadding;
  } else if (calculatedPctWidth) {
    if (wrappedLayouts.indexOf(layout!) > -1) {
      if (calculatedResizedPctWidth) {
        if (resizedPctWidth! < 50) {
          return calculatedResizedPctWidth;
        }
        return calculatedPctWidth;
      }
      return Math.min(calculatedPctWidth, origWidth);
    }
    if (calculatedResizedPctWidth) {
      return calculatedResizedPctWidth;
    }
    return calculatedPctWidth;
  } else if (layout === 'center') {
    if (calculatedResizedPctWidth) {
      return calculatedResizedPctWidth;
    }
    return Math.min(origWidth, lineLength || width);
  } else if (layout && wrappedLayouts.indexOf(layout) !== -1) {
    const halfLineLength = Math.ceil((lineLength || width) / 2);
    return origWidth <= halfLineLength ? origWidth : halfLineLength;
  }

  return origWidth;
};

export const snapToGrid = (
  gridWidth: number,
  width: number,
  height: number,
  lineLength: number,
  gridSize: number,
) => {
  const pxWidth = calcPxFromPct(gridWidth / 100, lineLength);

  const columnSpan = Math.round(
    calcColumnsFromPx(pxWidth, lineLength, gridSize),
  );

  const alignedWidth = calcPxFromColumns(columnSpan, lineLength, gridSize);

  return {
    height: (height / width) * alignedWidth,
    width: alignedWidth,
  };
};
