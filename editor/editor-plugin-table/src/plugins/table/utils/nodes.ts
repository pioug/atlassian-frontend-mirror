import { Node as PmNode } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { findTable } from '@atlaskit/editor-tables/utils';

import { pluginKey } from '../pm-plugins/plugin-key';

export const isIsolating = (node: PmNode): boolean => {
  return !!node.type.spec.isolating;
};

export const containsHeaderColumn = (table: PmNode): boolean => {
  const map = TableMap.get(table);
  // Get cell positions for first column.
  const cellPositions = map.cellsInRect({
    left: 0,
    top: 0,
    right: 1,
    bottom: map.height,
  });

  for (let i = 0; i < cellPositions.length; i++) {
    try {
      const cell = table.nodeAt(cellPositions[i]);
      if (cell && cell.type !== table.type.schema.nodes.tableHeader) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  return true;
};

export const containsHeaderRow = (table: PmNode): boolean => {
  const map = TableMap.get(table);
  for (let i = 0; i < map.width; i++) {
    const cell = table.nodeAt(map.map[i]);
    if (cell && cell.type !== table.type.schema.nodes.tableHeader) {
      return false;
    }
  }
  return true;
};

export const checkIfHeaderColumnEnabled = (selection: Selection): boolean =>
  filterNearSelection(selection, findTable, containsHeaderColumn, false);

export const checkIfHeaderRowEnabled = (selection: Selection): boolean =>
  filterNearSelection(selection, findTable, containsHeaderRow, false);

export const checkIfNumberColumnEnabled = (selection: Selection): boolean =>
  filterNearSelection(
    selection,
    findTable,
    (table) => !!table.attrs.isNumberColumnEnabled,
    false,
  );

export const isLayoutSupported = (state: EditorState): boolean => {
  const { permittedLayouts } = pluginKey.getState(state)?.pluginConfig || {};
  const { bodiedExtension, layoutSection, expand } = state.schema.nodes;

  return (
    !hasParentNodeOfType([expand, layoutSection, bodiedExtension])(
      state.selection,
    ) &&
    !!permittedLayouts &&
    (permittedLayouts === 'all' ||
      (permittedLayouts.indexOf('default') > -1 &&
        permittedLayouts.indexOf('wide') > -1 &&
        permittedLayouts.indexOf('full-width') > -1))
  );
};

export const getTableWidth = (node: PmNode) => {
  return getTableWidths(node).reduce((acc, current) => acc + current, 0);
};

export const tablesHaveDifferentColumnWidths = (
  currentTable: PmNode,
  previousTable: PmNode,
): boolean => {
  let currentTableWidths = getTableWidths(currentTable);
  let previousTableWidths = getTableWidths(previousTable);

  if (currentTableWidths.length !== previousTableWidths.length) {
    return true;
  }

  const sameWidths = currentTableWidths.every(
    (value: number, index: number) => {
      return value === previousTableWidths[index];
    },
  );

  return sameWidths === false;
};

export const tablesHaveDifferentNoOfColumns = (
  currentTable: PmNode,
  previousTable: PmNode,
): boolean => {
  const prevMap = TableMap.get(previousTable);
  const currentMap = TableMap.get(currentTable);

  return prevMap.width !== currentMap.width;
};

function filterNearSelection<T, U>(
  selection: Selection,
  findNode: (selection: Selection) => { pos: number; node: PmNode } | undefined,
  predicate: (node: PmNode, pos?: number) => T,
  defaultValue: U,
): T | U {
  const found = findNode(selection);
  if (!found) {
    return defaultValue;
  }

  return predicate(found.node, found.pos);
}

function getTableWidths(node: PmNode): number[] {
  if (!node.content.firstChild) {
    return [];
  }

  let tableWidths: Array<number> = [];
  node.content.firstChild.content.forEach((cell) => {
    if (Array.isArray(cell.attrs.colwidth)) {
      const colspan = cell.attrs.colspan || 1;
      tableWidths.push(...cell.attrs.colwidth.slice(0, colspan));
    }
  });

  return tableWidths;
}
