//#region Imports
import { Transaction } from 'prosemirror-state';
import { toggleHeader } from '@atlaskit/editor-tables/utils';
import { findTable } from '@atlaskit/editor-tables/utils';

import { TableLayout } from '@atlaskit/adf-schema';

import { Command } from '../../../types';
import { createCommand } from '../pm-plugins/plugin-factory';
//#endregion

// #region Utils
/**
 * Table layout toggle logic
 * default -> wide -> full-width -> default
 */
export const getNextLayout = (currentLayout: TableLayout): TableLayout => {
  switch (currentLayout) {
    case 'default':
      return 'wide';
    case 'wide':
      return 'full-width';
    case 'full-width':
      return 'default';
    default:
      return 'default';
  }
};
// #endregion

// #region Actions
export const toggleHeaderRow: Command = (state, dispatch): boolean =>
  toggleHeader('row')(state, (tr) =>
    createCommand({ type: 'TOGGLE_HEADER_ROW' }, () =>
      tr.setMeta('scrollIntoView', false),
    )(state, dispatch),
  );

export const toggleHeaderColumn: Command = (state, dispatch): boolean =>
  toggleHeader('column')(state, (tr) =>
    createCommand({ type: 'TOGGLE_HEADER_COLUMN' }, () =>
      tr.setMeta('scrollIntoView', false),
    )(state, dispatch),
  );

export const toggleNumberColumn: Command = (state, dispatch) => {
  const { tr } = state;
  const { node, pos } = findTable(state.selection)!;

  tr.setNodeMarkup(pos, state.schema.nodes.table, {
    ...node.attrs,
    isNumberColumnEnabled: !node.attrs.isNumberColumnEnabled,
  });
  tr.setMeta('scrollIntoView', false);

  if (dispatch) {
    dispatch(tr);
  }
  return true;
};

export const toggleTableLayout: Command = (state, dispatch): boolean => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }
  const layout = getNextLayout(table.node.attrs.layout);

  return createCommand(
    {
      type: 'SET_TABLE_LAYOUT',
      data: {
        layout,
      },
    },
    (tr: Transaction) => {
      tr.setNodeMarkup(table.pos, state.schema.nodes.table, {
        ...table.node.attrs,
        layout,
      });
      return tr.setMeta('scrollIntoView', false);
    },
  )(state, dispatch);
};

export const toggleContextualMenu = () =>
  createCommand(
    {
      type: 'TOGGLE_CONTEXTUAL_MENU',
    },
    (tr) => tr.setMeta('addToHistory', false),
  );
// #endregion
