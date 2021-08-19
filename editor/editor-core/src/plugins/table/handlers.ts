// #region Imports
import { Transaction } from 'prosemirror-state';
import { ContentNodeWithPos, findParentNodeOfType } from 'prosemirror-utils';
import { findTable } from '@atlaskit/editor-tables/utils';

import { isTextInput } from '../../utils/is-text-input';
import { collapseSelectedTable } from './utils/collapse';

import { defaultTableSelection } from './pm-plugins/default-table-selection';
import { pluginKey as tableResizingPluginKey } from './pm-plugins/table-resizing';
import { TablePluginState } from './types';
import { TableColumnOrdering, TableSortStep } from '@atlaskit/adf-schema/steps';
import { NodeType } from 'prosemirror-model';
// #endregion

const nextTableSorting = (
  tr: Transaction,
  table?: ContentNodeWithPos,
): TableColumnOrdering | undefined => {
  const tableSortStep: TableSortStep = tr.steps.find(
    (step) => step instanceof TableSortStep,
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

type BuilderTablePluginState = (props: {
  tr: Transaction;
  table?: ContentNodeWithPos;
}) => (pluginState: TablePluginState) => TablePluginState;

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

const updateTableNodePluginState: BuilderTablePluginState = ({ tr, table }) => (
  pluginState,
) => {
  const tableNode = table && table.node;

  if (!tableNode || isTextInput(tr)) {
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

const updateCollapseHandler: BuilderTablePluginState = ({ tr, table }) => (
  pluginState,
) => {
  const tableNode = table && table.node;
  const schema = tr.doc.type.schema;
  const allowCollapse = pluginState.pluginConfig.allowCollapse;
  const isExpandInSchema = schema.nodes.expand !== undefined;
  const isCollapseEnabled = allowCollapse && isExpandInSchema;

  /**
   * If we don't have focus, or collapse isn't allowed, or a table node doesn't
   * exist, we don't need to waste extra checks below
   */
  if (!pluginState.editorHasFocus || !isCollapseEnabled || !tableNode) {
    return pluginState;
  }

  const expandNodeType = schema.nodes.expand as NodeType;
  const isTableCollapsed =
    expandNodeType && !!findParentNodeOfType(expandNodeType)(tr.selection);

  // check result of wrapping without applying it
  const trCanBeCollapsed = collapseSelectedTable(tr);

  // We're focused on a table + we're not inside an expand
  const canCollapseTable: boolean =
    !!pluginState.tableNode &&
    // is it already collapsed?
    !isTableCollapsed &&
    !!trCanBeCollapsed;

  if (
    pluginState.isTableCollapsed !== isTableCollapsed ||
    pluginState.canCollapseTable !== canCollapseTable
  ) {
    return {
      ...pluginState,
      isTableCollapsed,
      canCollapseTable,
    };
  }

  return pluginState;
};

const buildPluginState = (
  builders: Array<BuilderTablePluginState>,
): BuilderTablePluginState => (props) => (pluginState) => {
  if (!props.table) {
    return pluginState.targetCellPosition
      ? { ...pluginState, targetCellPosition: undefined }
      : pluginState;
  }
  return builders.reduce(
    (_pluginState, transform) => transform(props)(_pluginState),
    pluginState,
  );
};

export const handleDocOrSelectionChanged = (
  tr: Transaction,
  pluginState: TablePluginState,
): TablePluginState =>
  buildPluginState([
    updateTargetCellPosition,
    updateTableNodePluginState,
    updateCollapseHandler,
  ])({
    tr,
    table: findTable(tr.selection),
  })(pluginState);
