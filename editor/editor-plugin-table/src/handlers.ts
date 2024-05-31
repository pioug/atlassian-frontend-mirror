// #region Imports
import { TableSortStep } from '@atlaskit/custom-steps';
import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import { isTextInput } from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { findTable } from '@atlaskit/editor-tables/utils';

import { defaultTableSelection } from './pm-plugins/default-table-selection';
import { pluginKey as tableResizingPluginKey } from './pm-plugins/table-resizing';
import type { TablePluginState } from './types';
import { isTableCollapsible } from './utils/collapse';
import {
	checkIfHeaderColumnEnabled,
	checkIfHeaderRowEnabled,
	checkIfNumberColumnEnabled,
} from './utils/nodes';

const nextTableSorting = (
	tr: Transaction | ReadonlyTransaction,
	table?: ContentNodeWithPos,
): TableColumnOrdering | undefined => {
	const tableSortStep: TableSortStep = tr.steps.find(
		(step) => step instanceof TableSortStep,
	) as TableSortStep;

	return tableSortStep && table && table.pos === tableSortStep.pos ? tableSortStep.next : undefined;
};

const nextResizeHandleColumnIndex = (
	tr: Transaction | ReadonlyTransaction,
	resizeHandleColumnIndex?: number,
): number | undefined => {
	if (tr.getMeta(tableResizingPluginKey)) {
		return undefined;
	}

	return resizeHandleColumnIndex;
};

type BuilderTablePluginState = (props: {
	tr: Transaction | ReadonlyTransaction;
	table?: ContentNodeWithPos;
}) => (pluginState: TablePluginState) => TablePluginState;

const updateTargetCellPosition: BuilderTablePluginState =
	({ tr, table }) =>
	(pluginState: TablePluginState) => {
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

const updateTableNodePluginState: BuilderTablePluginState =
	({ tr, table }) =>
	(pluginState) => {
		const tableNode = table && table.node;

		if (!tableNode || isTextInput(tr)) {
			return pluginState;
		}

		return {
			...pluginState,
			...defaultTableSelection,
			tableNode,
			ordering: nextTableSorting(tr, table),
			resizeHandleColumnIndex: nextResizeHandleColumnIndex(tr, pluginState.resizeHandleColumnIndex),
			isNumberColumnEnabled: checkIfNumberColumnEnabled(tr.selection),
			isHeaderColumnEnabled: checkIfHeaderColumnEnabled(tr.selection),
			isHeaderRowEnabled: checkIfHeaderRowEnabled(tr.selection),
		};
	};

const updateCollapseHandler: BuilderTablePluginState =
	({ tr, table }) =>
	(pluginState) => {
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
		const isTableCollapsed = expandNodeType && !!findParentNodeOfType(expandNodeType)(tr.selection);

		const trCanBeCollapsed = isTableCollapsible(tr).tableIsCollapsible;

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

const buildPluginState =
	(builders: Array<BuilderTablePluginState>): BuilderTablePluginState =>
	(props) =>
	(pluginState) => {
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
	tr: Transaction | ReadonlyTransaction,
	pluginState: TablePluginState,
): TablePluginState =>
	buildPluginState([updateTargetCellPosition, updateTableNodePluginState, updateCollapseHandler])({
		tr,
		table: findTable(tr.selection),
	})(pluginState);
