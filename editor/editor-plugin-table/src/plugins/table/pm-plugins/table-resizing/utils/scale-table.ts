import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';

import type { DomAtPos } from 'prosemirror-utils';

import { getTableWidth } from '../../../utils';
import { getLayoutSize } from '../utils/misc';
import { reduceSpace } from '../utils/resize-logic';
import {
  adjustColumnsWidths,
  getResizeState,
  getTotalWidth,
  updateColgroup,
} from '../utils/resize-state';
import { ResizeState } from '../utils/types';
import { hasTableBeenResized, insertColgroupFromNode } from './colgroup';
import { updateColumnWidths } from '../../../transforms';

export interface ScaleOptions {
  node: PMNode;
  prevNode: PMNode;
  start: number;
  containerWidth?: number;
  previousContainerWidth?: number;
  parentWidth?: number;
  layoutChanged?: boolean;
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
    prevNode,
    start,
    isBreakoutEnabled,
    layoutChanged,
  } = options;

  const maxSize = getLayoutSize(node.attrs.layout, containerWidth, {
    isBreakoutEnabled,
  });
  const prevTableWidth = getTableWidth(prevNode);
  const previousMaxSize = getLayoutSize(
    prevNode.attrs.layout,
    previousContainerWidth,
    {
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

export const previewScaleTable = (
  tableRef: HTMLTableElement | null | undefined,
  options: ScaleOptions,
  domAtPos: DomAtPos,
) => {
  const { node, start, parentWidth } = options;

  if (!tableRef || !hasTableBeenResized(node)) {
    return;
  }

  const resizeState = parentWidth
    ? scaleWithParent(tableRef, parentWidth, node, start, domAtPos)
    : scale(tableRef, options, domAtPos);

  if (resizeState) {
    updateColgroup(resizeState, tableRef);
  }
};

// Scale the table to meet new requirements (col, layout change etc)
export const scaleTable =
  (
    tableRef: HTMLTableElement | null | undefined,
    options: ScaleOptions,
    domAtPos: DomAtPos,
  ) =>
  (tr: Transaction) => {
    if (!tableRef) {
      return tr;
    }

    const { node, start, parentWidth, layoutChanged } = options;

    // If a table has not been resized yet, columns should be auto.
    if (hasTableBeenResized(node) === false) {
      // If its not a re-sized table, we still want to re-create cols
      // To force reflow of columns upon delete.
      insertColgroupFromNode(tableRef, node);
      return tr;
    }

    let resizeState;
    if (parentWidth) {
      resizeState = scaleWithParent(
        tableRef,
        parentWidth,
        node,
        start,
        domAtPos,
      );
    } else {
      resizeState = scale(tableRef, options, domAtPos);
    }

    if (resizeState) {
      tr = updateColumnWidths(resizeState, node, start)(tr);

      if (tr.docChanged) {
        tr.setMeta('scrollIntoView', false);
        // TODO: ED-8995
        // We need to do this check to reduce the number of race conditions when working with tables.
        // This metadata is been used in the sendTransaction function in the Collab plugin
        /* Added !layoutChanged check here to solve unnecessary scroll bar after publish when click on breakout button multiple times and publish
           scaleTable is only called once every time a breakout button is clicked, so it is safe not to add the meta 'scaleTable' to the tr.
           Leaving the tr.setMeta('scaleTable', true) here for race conditions that we aren't aware of.
         */
        !layoutChanged && tr.setMeta('scaleTable', true);
        return tr;
      }
    }

    return tr;
  };
