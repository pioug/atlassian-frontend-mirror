import type { CSSProperties } from 'react';
import React from 'react';
import type { TableLayout } from '@atlaskit/adf-schema';

import {
  tableCellBorderWidth,
  tableCellMinWidth,
} from '@atlaskit/editor-common/styles';
import {
  akEditorTableNumberColumnWidth,
  akEditorWideLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorTableLegacyCellMinWidth,
  akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import type { SharedTableProps } from './types';
import { isTableResizingEnabled } from '../table';

// we allow scaling down column widths by no more than 30%
// this intends to reduce unwanted scrolling in the Renderer in these scenarios:
// User A creates a table with column widths → User B views it on a smaller screen
// User A creates a table with column widths → User A views it with reduced viewport space (eg. Confluence sidebar is open)
const MAX_SCALING_PERCENT = 0.3;

const getTableLayoutWidth = (layout: TableLayout) => {
  switch (layout) {
    case 'full-width':
      return akEditorFullWidthLayoutWidth;
    case 'wide':
      return akEditorWideLayoutWidth;
    default:
      return akEditorDefaultLayoutWidth;
  }
};

const isTableResized = (columnWidths: Array<number>) => {
  const filteredWidths = columnWidths.filter((width) => width !== 0);
  return !!filteredWidths.length;
};

const fixColumnWidth = (
  columnWidth: number,
  _tableWidth: number,
  _layoutWidth: number,
  zeroWidthColumnsCount: number,
  scaleDownPercent: number,
): number => {
  if (columnWidth === 0) {
    return columnWidth;
  }

  // If the tables total width (including no zero widths col or cols without width) is less than the current layout
  // We scale up the columns to meet the minimum of the table layout.
  if (zeroWidthColumnsCount === 0 && scaleDownPercent) {
    return Math.max(
      Math.floor((1 - scaleDownPercent) * columnWidth),
      tableCellMinWidth,
    );
  }

  return Math.max(
    // We need to take tableCellBorderWidth, to avoid unnecessary overflow.
    columnWidth - tableCellBorderWidth,
    zeroWidthColumnsCount ? akEditorTableLegacyCellMinWidth : tableCellMinWidth,
  );
};

export interface ScaleOptions {
  renderWidth: number;
  tableWidth: number;
  maxScale: number;
}
export const calcScalePercent = ({
  renderWidth,
  tableWidth,
  maxScale,
}: ScaleOptions) => {
  const diffPercent = 1 - renderWidth / tableWidth;
  return diffPercent < maxScale ? diffPercent : maxScale;
};

const renderScaleDownColgroup = (
  props: SharedTableProps,
): CSSProperties[] | null => {
  let {
    columnWidths,
    layout,
    isNumberColumnEnabled,
    renderWidth,
    tableNode,
    rendererAppearance,
  } = props;

  let tableContainerWidth: number;

  if (!columnWidths) {
    return [];
  }

  const columnAmount = columnWidths.length;

  const tableResized = isTableResized(columnWidths);

  let targetWidths;
  if (isTableResizingEnabled(rendererAppearance) && !tableResized) {
    if (
      getBooleanFF(
        'platform.editor.custom-table-width-scale-down-undefined-column_nkyvx',
      )
    ) {
      // Code path executed when feature flag is on
      const tableDefaultWidth = isNumberColumnEnabled
        ? akEditorDefaultLayoutWidth - akEditorTableNumberColumnWidth
        : akEditorDefaultLayoutWidth;
      // take off 1 px for border incase column width wider than table width
      const defaultColumnWidth = Math.floor(
        (tableDefaultWidth - 1) / columnAmount,
      );
      targetWidths = new Array(columnAmount).fill(defaultColumnWidth);
    } else {
      return new Array(columnAmount).fill({
        minWidth: `${tableCellMinWidth}px`,
      });
    }
  } else if (!tableResized) {
    return null;
  }

  targetWidths = targetWidths || columnWidths;

  if (isTableResizingEnabled(rendererAppearance) && tableNode) {
    tableContainerWidth = getTableContainerWidth(tableNode);
  } else {
    tableContainerWidth = getTableLayoutWidth(layout);
  }

  // @see ED-6056
  const maxTableWidth =
    renderWidth < tableContainerWidth ? renderWidth : tableContainerWidth;

  const targetWidth =
    !getBooleanFF(
      'platform.editor.disable-default-width-table-scaling-renderer',
    ) && layout === 'default'
      ? Math.min(renderWidth, tableContainerWidth)
      : renderWidth;

  let tableWidth = isNumberColumnEnabled ? akEditorTableNumberColumnWidth : 0;
  let minTableWidth = tableWidth;
  let zeroWidthColumnsCount = 0;

  targetWidths.forEach((width) => {
    if (width) {
      tableWidth += Math.ceil(width);
    } else {
      zeroWidthColumnsCount += 1;
    }
    minTableWidth += Math.ceil(width) || akEditorTableLegacyCellMinWidth;
  });
  let cellMinWidth = 0;
  let scaleDownPercent = 0;
  // fixes migration tables with zero-width columns
  if (zeroWidthColumnsCount > 0) {
    if (minTableWidth > maxTableWidth) {
      const minWidth = Math.ceil(
        (maxTableWidth - tableWidth) / zeroWidthColumnsCount,
      );
      cellMinWidth =
        minWidth < akEditorTableLegacyCellMinWidth
          ? akEditorTableLegacyCellMinWidth
          : minWidth;
    }
  }
  // scaling down
  else if (targetWidth < tableWidth) {
    scaleDownPercent = calcScalePercent({
      renderWidth: targetWidth,
      tableWidth,
      maxScale: MAX_SCALING_PERCENT,
    });
  }

  return targetWidths.map((colWidth) => {
    const width =
      fixColumnWidth(
        colWidth,
        minTableWidth,
        maxTableWidth,
        zeroWidthColumnsCount,
        scaleDownPercent,
      ) || cellMinWidth;

    const style = width ? { width: `${width}px` } : {};
    return style;
  });
};

export const Colgroup = (props: SharedTableProps) => {
  let { columnWidths, isNumberColumnEnabled } = props;

  if (!columnWidths) {
    return null;
  }

  const colStyles = renderScaleDownColgroup(props);

  if (!colStyles) {
    return null;
  }

  return (
    <colgroup>
      {isNumberColumnEnabled && (
        <col
          style={{ width: akEditorTableNumberColumnWidth }}
          data-test-id={'num'}
        />
      )}
      {colStyles.map((style, idx) => (
        <col key={idx} style={style} />
      ))}
    </colgroup>
  );
};
