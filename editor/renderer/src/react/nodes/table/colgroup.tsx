import React from 'react';
import { TableLayout } from '@atlaskit/adf-schema';

import {
  tableCellBorderWidth,
  tableCellMinWidth,
} from '@atlaskit/editor-common';
import {
  akEditorTableNumberColumnWidth,
  akEditorWideLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorTableLegacyCellMinWidth,
} from '@atlaskit/editor-shared-styles';

import { calcLineLength } from '../../../ui/Renderer/breakout-ssr';
import { SharedTableProps } from './types';

interface TableWidthOptions {
  isDynamicTextSizingEnabled?: boolean;
  containerWidth?: number;
}

// we allow scaling down column widths by no more than 15%
const MAX_SCALING_PERCENT = 0.15;

const getTableLayoutWidth = (layout: TableLayout, opts?: TableWidthOptions) => {
  switch (layout) {
    case 'full-width':
      return akEditorFullWidthLayoutWidth;
    case 'wide':
      return akEditorWideLayoutWidth;
    default:
      const { containerWidth, isDynamicTextSizingEnabled } = opts || {};
      return calcLineLength(containerWidth, isDynamicTextSizingEnabled);
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
    return Math.floor((1 - scaleDownPercent) * columnWidth);
  }

  return Math.max(
    // We need to take tableCellBorderWidth, to avoid unneccesary overflow.
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

export const Colgroup = (props: SharedTableProps) => {
  let {
    columnWidths,
    layout,
    isNumberColumnEnabled,
    renderWidth,
    allowDynamicTextSizing,
  } = props;
  if (!columnWidths || !isTableResized(columnWidths)) {
    return null;
  }

  // @see ED-6056
  const layoutWidth = getTableLayoutWidth(layout, {
    isDynamicTextSizingEnabled: allowDynamicTextSizing,
    containerWidth: renderWidth,
  });
  const maxTableWidth = renderWidth < layoutWidth ? renderWidth : layoutWidth;

  // If table has a layout of default, it is confined by the defined column width.
  // renderWidth is better used for breakout tables.
  // @see ED-6737
  if (layout === 'default') {
    renderWidth = Math.min(renderWidth, layoutWidth);
  }

  let tableWidth = isNumberColumnEnabled ? akEditorTableNumberColumnWidth : 0;
  let minTableWidth = tableWidth;
  let zeroWidthColumnsCount = 0;

  columnWidths.forEach((width) => {
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
  else if (renderWidth < tableWidth) {
    scaleDownPercent = calcScalePercent({
      renderWidth,
      tableWidth,
      maxScale: MAX_SCALING_PERCENT,
    });
  }

  return (
    <colgroup>
      {isNumberColumnEnabled && (
        <col style={{ width: akEditorTableNumberColumnWidth }} />
      )}
      {columnWidths.map((colWidth, idx) => {
        const width =
          fixColumnWidth(
            colWidth,
            minTableWidth,
            maxTableWidth,
            zeroWidthColumnsCount,
            scaleDownPercent,
          ) || cellMinWidth;

        const style = width ? { width: `${width}px` } : {};
        return <col key={idx} style={style} />;
      })}
    </colgroup>
  );
};
