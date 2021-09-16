import { Node as PMNode } from 'prosemirror-model';

import { tableCellMinWidth } from '@atlaskit/editor-common';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';

import { DomAtPos } from '../../../../../types';
import { getTableWidth } from '../../../utils';
import { getLayoutSize } from '../utils/misc';
import { reduceSpace } from '../utils/resize-logic';
import {
  adjustColumnsWidths,
  getResizeState,
  getTotalWidth,
} from '../utils/resize-state';
import { ResizeState } from '../utils/types';

export interface ScaleOptions {
  node: PMNode;
  prevNode: PMNode;
  start: number;
  containerWidth?: number;
  previousContainerWidth?: number;
  parentWidth?: number;
  layoutChanged?: boolean;
  dynamicTextSizing?: boolean;
  isBreakoutEnabled?: boolean;
  isFullWidthModeEnabled?: boolean;
}

// Base function to trigger the actual scale on a table node.
// Will only resize/scale if a table has been previously resized.
export const scale = (
  tableRef: HTMLTableElement,
  options: ScaleOptions,
  domAtPos: DomAtPos,
): ResizeState | undefined => {
  /**
   * isBreakoutEnabled === true -> default center aligned
   * isBreakoutEnabled === false -> full width mode
   */

  const {
    node,
    containerWidth,
    previousContainerWidth,
    dynamicTextSizing,
    prevNode,
    start,
    isBreakoutEnabled,
    layoutChanged,
  } = options;

  const maxSize = getLayoutSize(node.attrs.layout, containerWidth, {
    dynamicTextSizing,
    isBreakoutEnabled,
  });
  const prevTableWidth = getTableWidth(prevNode);
  const previousMaxSize = getLayoutSize(
    prevNode.attrs.layout,
    previousContainerWidth,
    {
      dynamicTextSizing,
      isBreakoutEnabled,
    },
  );

  let newWidth = maxSize;

  // adjust table width if layout is updated
  const hasOverflow = prevTableWidth > previousMaxSize;
  if (layoutChanged && hasOverflow) {
    // No keep overflow if the old content can be in the new size
    const canFitInNewSize = prevTableWidth < maxSize;
    if (canFitInNewSize) {
      newWidth = maxSize;
    } else {
      // Keep the same scale.
      const overflowScale = prevTableWidth / previousMaxSize;
      newWidth = Math.floor(newWidth * overflowScale);
    }
  }

  if (node.attrs.isNumberColumnEnabled) {
    newWidth -= akEditorTableNumberColumnWidth;
  }

  const resizeState = getResizeState({
    minWidth: tableCellMinWidth,
    maxSize,
    table: node,
    tableRef,
    start,
    domAtPos,
  });

  return scaleTableTo(resizeState, newWidth);
};

export const scaleWithParent = (
  tableRef: HTMLTableElement,
  parentWidth: number,
  table: PMNode,
  start: number,
  domAtPos: DomAtPos,
) => {
  const resizeState = getResizeState({
    minWidth: tableCellMinWidth,
    maxSize: parentWidth,
    table,
    tableRef,
    start,
    domAtPos,
  });

  if (table.attrs.isNumberColumnEnabled) {
    parentWidth -= akEditorTableNumberColumnWidth;
  }

  return scaleTableTo(resizeState, Math.floor(parentWidth));
};

// Scales the table to a given size and updates its colgroup DOM node
export function scaleTableTo(state: ResizeState, maxSize: number): ResizeState {
  const scaleFactor = maxSize / getTotalWidth(state);

  let newState = {
    ...state,
    maxSize,
    cols: state.cols.map((col) => {
      const { minWidth, width } = col;
      let newColWidth = Math.floor(width * scaleFactor);
      if (newColWidth < minWidth) {
        newColWidth = minWidth;
      }
      return { ...col, width: newColWidth };
    }),
  };

  let newTotalWidth = getTotalWidth(newState);
  if (newTotalWidth > maxSize) {
    newState = reduceSpace(newState, newTotalWidth - maxSize);
  }

  return adjustColumnsWidths(newState, maxSize);
}
