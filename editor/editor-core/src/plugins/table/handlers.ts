// #region Imports
import { Transaction } from 'prosemirror-state';
import {
  findTable,
  findParentNodeOfType,
  ContentNodeWithPos,
} from 'prosemirror-utils';
import { pluginKey as tableResizingPluginKey } from './pm-plugins/table-resizing';
import { TablePluginState, TableColumnOrdering } from './types';
import { TableSortStep } from './utils/sort-step';
import {
  buildTableDecorationSet,
  hasColumnSelectedDecorations,
  removeColumnControlsSelected as removeColumnControlsSelectedDecorations,
} from './decorations';
import { defaultTableSelection } from './pm-plugins/default-table-selection';
import { DecorationSet } from 'prosemirror-view';
import { CellSelection } from 'prosemirror-tables';
// #endregion

const nextTableSorting = (
  tr: Transaction,
  table?: ContentNodeWithPos,
): TableColumnOrdering | undefined => {
  const tableSortStep: TableSortStep = tr.steps.find(
    step => step instanceof TableSortStep,
  ) as TableSortStep;

  return tableSortStep && table && table.pos === tableSortStep.pos
    ? tableSortStep.next
    : undefined;
};

const nextResizeHandleColumnIndex = (
  tr: Transaction,
  resizeHandleColumnIndex?: number,
): number | undefined => {
  if (tr.getMeta(tableResizingPluginKey)) {
    return undefined;
  }

  return resizeHandleColumnIndex;
};

type BuilderTablePluginStateProps = {
  tr: Transaction;
  table?: ContentNodeWithPos;
};
type BuilderTablePluginState = (
  props: BuilderTablePluginStateProps,
) => (pluginState: TablePluginState) => TablePluginState;

const updateTargetCellPosition: BuilderTablePluginState = ({ tr, table }) => (
  pluginState: TablePluginState,
) => {
  const tableNode = table && table.node;
  if (!tableNode) {
    return {
      ...pluginState,
      targetCellPosition: undefined,
    };
  }

  const { tableCell, tableHeader } = tr.doc.type.schema.nodes;
  const cell = findParentNodeOfType([tableCell, tableHeader])(tr.selection);
  const targetCellPosition = cell ? cell.pos : undefined;

  if (pluginState.targetCellPosition === targetCellPosition) {
    return pluginState;
  }

  return {
    ...pluginState,
    targetCellPosition,
  };
};

const updateTableNodePluginState: BuilderTablePluginState = ({
  tr,
  table,
}) => pluginState => {
  const tableNode = table && table.node;

  if (!tableNode) {
    return pluginState;
  }

  return {
    ...pluginState,
    ...defaultTableSelection,
    tableNode,
    ordering: nextTableSorting(tr, table),
    resizeHandleColumnIndex: nextResizeHandleColumnIndex(
      tr,
      pluginState.resizeHandleColumnIndex,
    ),
  };
};

const updateDecorationSet: BuilderTablePluginState = ({
  tr,
  table,
}) => pluginState => {
  if (!(tr.docChanged || tr.selection instanceof CellSelection)) {
    return pluginState;
  }

  return {
    ...pluginState,
    decorationSet: buildTableDecorationSet(true)({
      decorationSet: DecorationSet.empty,
      tr,
    }),
  };
};

const updateColumnControlsSelectedDecorations: BuilderTablePluginState = ({
  tr,
}) => pluginState => {
  const isTransactionFromMouseClick =
    !tr.docChanged && tr.selectionSet && tr.getMeta('pointer');

  if (
    !isTransactionFromMouseClick ||
    !hasColumnSelectedDecorations(pluginState.decorationSet)
  ) {
    return pluginState;
  }

  return {
    ...pluginState,
    decorationSet: removeColumnControlsSelectedDecorations(
      pluginState.decorationSet,
    ),
  };
};

const buildPluginState = (
  builders: Array<BuilderTablePluginState>,
): BuilderTablePluginState => props => pluginState =>
  builders.reduce(
    (_pluginState, transform) => transform(props)(_pluginState),
    pluginState,
  );

export const handleDocOrSelectionChanged = (
  tr: Transaction,
  pluginState: TablePluginState,
): TablePluginState =>
  buildPluginState([
    updateTargetCellPosition,
    updateTableNodePluginState,
    updateColumnControlsSelectedDecorations,
    updateDecorationSet,
  ])({ tr, table: findTable(tr.selection) })(pluginState);
