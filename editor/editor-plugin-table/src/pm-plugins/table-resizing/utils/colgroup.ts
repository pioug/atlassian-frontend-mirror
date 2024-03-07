import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import { getFragmentBackingArray } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { MAX_SCALING_PERCENT } from './consts';

type Col = Array<string | { [name: string]: string }>;

/**
 * This ensures the combined width of the columns (and tbody) of table is always smaller or equal
 * than the table and table wrapper elements. This is necessary as there is no longer
 * padding on the .pm-table-wrapper, so all elements need to be the same width to avoid
 * overflow.
 */
export const getColWidthFix = (colwidth: number, tableColumnCount: number) =>
  colwidth - 1 / tableColumnCount;

export const generateColgroup = (table: PmNode, tableRef?: HTMLElement) => {
  const cols: Col[] = [];

  if (getBooleanFF('platform.editor.custom-table-width')) {
    const map = TableMap.get(table);
    table.content.firstChild!.content.forEach((cell) => {
      const colspan = cell.attrs.colspan || 1;
      if (Array.isArray(cell.attrs.colwidth)) {
        // We slice here to guard against our colwidth array having more entries
        // Than the we actually span. We'll patch the document at a later point.
        if (tableRef) {
          const tableWidth = table.attrs && table.attrs.width;
          let renderWidth = tableRef.parentElement?.clientWidth || 760;
          let scalePercent = renderWidth / tableWidth;
          scalePercent = Math.max(scalePercent, 1 - MAX_SCALING_PERCENT);
          cell.attrs.colwidth.slice(0, colspan).forEach((width) => {
            const fixedColWidth = getColWidthFix(width, map.width);
            const scaledWidth = fixedColWidth * Math.min(scalePercent, 1);
            const finalWidth = Math.max(scaledWidth, tableCellMinWidth);
            cols.push([
              'col',
              {
                style: `width: ${finalWidth}px;`,
              },
            ]);
          });
        } else {
          cell.attrs.colwidth.slice(0, colspan).forEach((width) => {
            cols.push([
              'col',
              {
                style: `width: ${getColWidthFix(
                  width
                    ? Math.max(width, tableCellMinWidth)
                    : tableCellMinWidth,
                  map.width,
                )}px;`,
              },
            ]);
          });
        }
      } else {
        // When we have merged cells on the first row (firstChild),
        // We want to ensure we're creating the appropriate amount of
        // cols the table still has.
        cols.push(
          ...Array.from({ length: colspan }, (_) => [
            'col',
            { style: `width: ${tableCellMinWidth}px;` },
          ]),
        );
      }
    });
  } else {
    table.content.firstChild!.content.forEach((cell) => {
      const colspan = cell.attrs.colspan || 1;
      if (Array.isArray(cell.attrs.colwidth)) {
        // We slice here to guard against our colwidth array having more entries
        // Than the we actually span. We'll patch the document at a later point.
        cell.attrs.colwidth.slice(0, colspan).forEach((width) => {
          cols.push(['col', width ? { style: `width: ${width}px;` } : {}]);
        });
      } else {
        // When we have merged cells on the first row (firstChild),
        // We want to ensure we're creating the appropriate amount of
        // cols the table still has.
        cols.push(...Array.from({ length: colspan }, (_) => ['col', {}]));
      }
    });
  }

  return cols;
};

export const insertColgroupFromNode = (
  tableRef: HTMLTableElement,
  table: PmNode,
  tablePreserveWidth = false,
  shouldRemove = true,
): HTMLCollection => {
  let colgroup = tableRef.querySelector('colgroup') as HTMLElement;
  if (colgroup && shouldRemove) {
    tableRef.removeChild(colgroup);
  }

  colgroup = renderColgroupFromNode(
    table,
    tablePreserveWidth ? tableRef : undefined,
  );
  if (shouldRemove) {
    tableRef.insertBefore(colgroup, tableRef.firstChild);
  }

  return colgroup.children;
};

export const hasTableBeenResized = (table: PmNode) => {
  return !!getFragmentBackingArray(table.content.firstChild!.content).find(
    (cell) => cell.attrs.colwidth,
  );
};

/**
 * Check if a table has all the column width set to tableCellMinWidth(48px) or null
 *
 * @param table
 * @returns true if all column width is equal to tableCellMinWidth or null, false otherwise
 */
export const isMinCellWidthTable = (table: PmNode) => {
  const cellArray = getFragmentBackingArray(table.content.firstChild!.content);
  const isTableMinCellWidth = cellArray.every((cell) => {
    return (
      (cell.attrs.colwidth && cell.attrs.colwidth[0] === tableCellMinWidth) ||
      cell.attrs.colwidth === null
    );
  });

  return isTableMinCellWidth;
};

function renderColgroupFromNode(
  table: PmNode,
  maybeTableRef: HTMLElement | undefined,
): HTMLElement {
  const rendered = DOMSerializer.renderSpec(document, [
    'colgroup',
    {},
    ...generateColgroup(table, maybeTableRef),
  ]);

  return rendered.dom as HTMLElement;
}

export const getColgroupChildrenLength = (table: PmNode): number => {
  const map = TableMap.get(table);
  return map.width;
};
