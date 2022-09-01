import React from 'react';
import { TableLayout } from '@atlaskit/adf-schema';

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

import { SharedTableProps } from './types';

interface TableWidthOptions {
  containerWidth?: number;
}

const getTableLayoutWidth = (layout: TableLayout, opts?: TableWidthOptions) => {
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
): number => {
  if (columnWidth === 0) {
    return columnWidth;
  }

  return Math.max(
    // We need to take tableCellBorderWidth, to avoid unneccesary overflow.
    columnWidth - tableCellBorderWidth,
    zeroWidthColumnsCount ? akEditorTableLegacyCellMinWidth : tableCellMinWidth,
  );
};

export const Colgroup = (props: SharedTableProps) => {
  let { columnWidths, layout, isNumberColumnEnabled, renderWidth } = props;
  if (!columnWidths || !isTableResized(columnWidths)) {
    return null;
  }

  // @see ED-6056
  const layoutWidth = getTableLayoutWidth(layout, {
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
          ) || cellMinWidth;

        const style = width ? { width: `${width}px` } : {};
        return <col key={idx} style={style} />;
      })}
    </colgroup>
  );
};
