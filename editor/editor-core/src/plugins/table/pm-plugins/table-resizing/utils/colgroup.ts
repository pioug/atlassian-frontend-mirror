import { DOMSerializer, Node as PmNode } from 'prosemirror-model';

import { getFragmentBackingArray } from '../../../../../utils/slice';

type Col = Array<string | { [name: string]: string }>;

export const generateColgroup = (table: PmNode): Col[] => {
  const cols: Col[] = [];

  table.content.firstChild!.content.forEach((cell) => {
    const colspan = cell.attrs.colspan || 1;
    if (Array.isArray(cell.attrs.colwidth)) {
      // We slice here to guard against our colwidth array having more entries
      // Than the we actually span. We'll patch the document at a later point.
      cell.attrs.colwidth.slice(0, colspan).forEach((width) => {
        cols.push(['col', { style: `width: ${width}px;` }]);
      });
    } else {
      // When we have merged cells on the first row (firstChild),
      // We want to ensure we're creating the appropriate amount of
      // cols the table still has.
      cols.push(...Array.from({ length: colspan }, (_) => ['col', {}]));
    }
  });

  return cols;
};

export const insertColgroupFromNode = (
  tableRef: HTMLTableElement,
  table: PmNode,
): HTMLCollection => {
  let colgroup = tableRef.querySelector('colgroup') as HTMLElement;
  if (colgroup) {
    tableRef.removeChild(colgroup);
  }

  colgroup = renderColgroupFromNode(table);
  tableRef.insertBefore(colgroup, tableRef.firstChild);

  return colgroup.children;
};

export const hasTableBeenResized = (table: PmNode) => {
  return !!getFragmentBackingArray(table.content.firstChild!.content).find(
    (cell) => cell.attrs.colwidth,
  );
};

function renderColgroupFromNode(table: PmNode): HTMLElement {
  const rendered = DOMSerializer.renderSpec(document, [
    'colgroup',
    {},
    ...generateColgroup(table),
  ]);

  return rendered.dom as HTMLElement;
}
