import { Node as PmNode } from 'prosemirror-model';

export function calcTableColumnWidths(node: PmNode): number[] {
  let tableColumnWidths: Array<number> = [];
  const firstRow = node.firstChild;

  if (firstRow) {
    // Sanity validation, but it should always have a first row
    // Iterate for the cells in the first row
    firstRow.forEach(colNode => {
      let colwidth = colNode.attrs.colwidth || [0];

      // If we have colwidth, we added it
      if (colwidth) {
        tableColumnWidths = [...tableColumnWidths, ...colwidth];
      }
    });
  }

  return tableColumnWidths;
}

export function hasMergedCell(tableNode: PmNode): boolean {
  let hasSpan = false;

  tableNode.descendants(node => {
    if (node.type.name === 'tableRow') {
      return true;
    }

    const { colspan, rowspan } = node.attrs;

    if (colspan > 1 || rowspan > 1) {
      hasSpan = true;
    }

    return false;
  });

  return hasSpan;
}

export function convertProsemirrorTableNodeToArrayOfRows(
  tableNode: PmNode,
): Array<Array<PmNode | null>> {
  const result: Array<Array<PmNode>> = [];

  tableNode.forEach(rowNode => {
    if (rowNode.type.name === 'tableRow') {
      const row: Array<PmNode> = [];
      rowNode.forEach(n => row.push(n));
      result.push(row);
    }
  });

  return result;
}
