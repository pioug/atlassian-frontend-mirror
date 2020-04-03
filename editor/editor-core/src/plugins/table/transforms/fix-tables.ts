import { Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { TableLayout } from '@atlaskit/adf-schema';
import {
  akEditorWideLayoutWidth,
  akEditorDefaultLayoutWidth,
  tableCellMinWidth,
} from '@atlaskit/editor-common';

import {
  calculateColumnWidth,
  getCellsRefsInColumn,
  contentWidth,
  getLayoutSize,
} from '../pm-plugins/table-resizing/utils';
import { sendLogs } from '../../../utils/sendLogs';

export const fireAnalytics = (properties = {}) =>
  sendLogs({
    events: [
      {
        name: 'atlaskit.fabric.editor.fixtable',
        product: 'atlaskit',
        properties,
        serverTime: new Date().getTime(),
        server: 'local',
        user: '-',
      },
    ],
  });

// We attempt to patch the document when we have extra, unneeded, column widths
// Take this node for example:
//
//    ['td', { colwidth: [100, 100, 100], colspan: 2 }]
//
// This row only spans two columns, yet it contains widths for 3.
// We remove the third width here, assumed duplicate content.
export const removeExtraneousColumnWidths = (
  node: PMNode,
  basePos: number,
  tr: Transaction,
): boolean => {
  let hasProblems = false;

  tr = replaceCells(tr, node, basePos, cell => {
    const { colwidth, colspan } = cell.attrs;

    if (colwidth && colwidth.length > colspan) {
      hasProblems = true;
      return cell.type.createChecked(
        {
          ...cell.attrs,
          colwidth: colwidth.slice(0, colspan),
        },
        cell.content,
        cell.marks,
      );
    }

    return cell;
  });

  if (hasProblems) {
    fireAnalytics({ message: 'removeExtraneousColumnWidths' });
    return true;
  }

  return false;
};

export const fixTables = (tr: Transaction): Transaction | undefined => {
  let hasProblems = false;
  tr.doc.descendants((node, pos) => {
    if (node.type.name === 'table') {
      // in the unlikely event of having to fix multiple tables at the same time
      hasProblems = removeExtraneousColumnWidths(node, tr.mapping.map(pos), tr);
    }
  });

  if (hasProblems) {
    return tr;
  }
};

// When we get a table with an 'auto' attribute, we want to:
// 1. render with table-layout: auto
// 2. capture the column widths
// 3. set the column widths as attributes, and remove the 'auto' attribute,
//    so the table renders the same, but is now fixed-width
//
// This can be used to migrate table appearances from other sources that are
// usually rendered with 'auto'.
//
// We use this when migrating TinyMCE tables for Confluence, for example:
// https://pug.jira-dev.com/wiki/spaces/AEC/pages/3362882215/How+do+we+map+TinyMCE+tables+to+Fabric+tables
export const fixAutoSizedTable = (
  view: EditorView,
  tableNode: PMNode,
  tableRef: HTMLTableElement,
  tablePos: number,
  opts: { dynamicTextSizing: boolean; containerWidth: number },
): Transaction => {
  let { tr } = view.state;
  const domAtPos = view.domAtPos.bind(view);
  const tableStart = tablePos + 1;
  const colWidths = parseDOMColumnWidths(
    domAtPos,
    tableNode,
    tableStart,
    tableRef,
  );
  const totalContentWidth = colWidths.reduce(
    (acc, current) => acc + current,
    0,
  );
  const tableLayout = getLayoutBasedOnWidth(totalContentWidth);
  const maxLayoutSize = getLayoutSize(tableLayout, opts.containerWidth, {
    dynamicTextSizing: opts.dynamicTextSizing,
  });

  // Content width will generally not meet the constraints of the layout
  // whether it be below or above, so we scale our columns widths
  // to meet these requirements
  let scale = 1;
  if (totalContentWidth !== maxLayoutSize) {
    scale = maxLayoutSize / totalContentWidth;
  }

  const scaledColumnWidths = colWidths.map(width => Math.floor(width * scale));

  tr = replaceCells(tr, tableNode, tablePos, (cell, _rowIndex, colIndex) => {
    const newColWidths = scaledColumnWidths.slice(
      colIndex,
      colIndex + cell.attrs.colspan,
    );
    return cell.type.createChecked(
      {
        ...cell.attrs,
        colwidth: newColWidths.length ? newColWidths : null,
      },
      cell.content,
      cell.marks,
    );
  });

  // clear autosizing on the table node
  return tr
    .setNodeMarkup(tablePos, undefined, {
      ...tableNode.attrs,
      layout: tableLayout,
      __autoSize: false,
    })
    .setMeta('addToHistory', false);
};

const getLayoutBasedOnWidth = (totalWidth: number): TableLayout => {
  if (totalWidth > akEditorWideLayoutWidth) {
    return 'full-width';
  } else if (
    totalWidth > akEditorDefaultLayoutWidth &&
    totalWidth < akEditorWideLayoutWidth
  ) {
    return 'wide';
  } else {
    return 'default';
  }
};

function parseDOMColumnWidths(
  domAtPos: (pos: number) => { node: Node; offset: number },
  tableNode: PMNode,
  tableStart: number,
  tableRef: HTMLTableElement,
): Array<number> {
  const row = tableRef.querySelector('tr');

  if (!row) {
    return [];
  }

  let cols: Array<number> = [];

  for (let col = 0; col < row.childElementCount; col++) {
    const currentCol = row.children[col];
    const colspan = Number(currentCol.getAttribute('colspan') || 1);
    for (let span = 0; span < colspan; span++) {
      const colIdx = col + span;
      const cells = getCellsRefsInColumn(
        colIdx,
        tableNode,
        tableStart,
        domAtPos,
      );
      const colWidth = calculateColumnWidth(cells, (_, col) => {
        return contentWidth(col as HTMLElement, tableRef).width;
      });

      cols[colIdx] = Math.max(colWidth, tableCellMinWidth);
    }
  }

  return cols;
}

// TODO: move to prosemirror-utils
const replaceCells = (
  tr: Transaction,
  table: PMNode,
  tablePos: number,
  modifyCell: (cell: PMNode, rowIndex: number, colIndex: number) => PMNode,
): Transaction => {
  const rows: PMNode[] = [];
  let modifiedCells = 0;
  for (let rowIndex = 0; rowIndex < table.childCount; rowIndex++) {
    const row = table.child(rowIndex);
    const cells: PMNode[] = [];

    for (let colIndex = 0; colIndex < row.childCount; colIndex++) {
      const cell = row.child(colIndex);

      // FIXME
      // The rowIndex and colIndex are not accurate in a merged cell scenario
      // e.g. table with 5 columns might have only one cell in a row, colIndex will be 1, where it should be 4
      const node = modifyCell(cell, rowIndex, colIndex);
      if (node.sameMarkup(cell) === false) {
        modifiedCells++;
      }
      cells.push(node);
    }

    if (cells.length) {
      rows.push(row.type.createChecked(row.attrs, cells, row.marks));
    }
  }

  // Check if the table has changed before replacing.
  // If no cells are modified our counter will be zero.
  if (rows.length && modifiedCells !== 0) {
    const newTable = table.type.createChecked(table.attrs, rows, table.marks);
    return tr.replaceWith(tablePos, tablePos + table.nodeSize, newTable);
  }

  return tr;
};
