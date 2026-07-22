// #region Imports
import { TableSortStep } from '@atlaskit/custom-steps';
import type { TableColumnOrdering } from '@atlaskit/custom-steps';
import { isTextInput } from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
// @ts-ignore -- ReadonlyTransaction is a local declaration and will cause a TS2305 error in CCFE typecheck
import type { ReadonlyTransaction, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findTable } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { TablePluginState } from '../types';

import { defaultTableSelection } from './default-table-selection';
import { pluginKey as tableResizingPluginKey } from './table-resizing/plugin-key';
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
	table?: ContentNodeWithPos;
	tr: Transaction | ReadonlyTransaction;
}) => (pluginState: TablePluginState) => TablePluginState;

const shouldCloseLegacyContextualMenu = ({
	pluginState,
	targetCellPositionChanged,
	tr,
}: {
	pluginState: TablePluginState;
	targetCellPositionChanged: boolean;
	tr: Transaction | ReadonlyTransaction;
}): boolean =>
	Boolean(
		pluginState.isContextualMenuOpen &&
		(targetCellPositionChanged || (tr.selectionSet && !(tr.selection instanceof CellSelection))),
	);

const updateTargetCellPosition: BuilderTablePluginState =
	({ tr, table }) =>
	(pluginState: TablePluginState) => {
		const tableNode = table && table.node;
		if (expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)) {
			let targetCellPosition: number | undefined;

			if (tableNode) {
				const { tableCell, tableHeader } = tr.doc.type.schema.nodes;
				const cell = findParentNodeOfType([tableCell, tableHeader])(tr.selection);
				targetCellPosition = cell ? cell.pos : undefined;
			}

			const hasTargetCellChanged = pluginState.targetCellPosition !== targetCellPosition;
			const hasActiveTableMenu =
				pluginState.activeTableMenu != null && pluginState.activeTableMenu.type !== 'none';

			const shouldCloseMenu =
				hasActiveTableMenu &&
				tr.selectionSet &&
				(!tableNode || hasTargetCellChanged || !(tr.selection instanceof CellSelection));

			if (!hasTargetCellChanged && !shouldCloseMenu) {
				return pluginState;
			}

			// The updated table menu is anchored to a table selection. When selection moves
			// to another cell, leaves the table, or changes from a CellSelection to a text cursor,
			// close the active menu so render state cannot point at a stale anchor.
			return {
				...pluginState,
				targetCellPosition,
				activeTableMenu: shouldCloseMenu ? { type: 'none' } : pluginState.activeTableMenu,
			};
		}

		if (!tableNode) {
			return {
				...pluginState,
				targetCellPosition: undefined,
			};
		}

		const { tableCell, tableHeader } = tr.doc.type.schema.nodes;
		const cell = findParentNodeOfType([tableCell, tableHeader])(tr.selection);
		const targetCellPosition = cell ? cell.pos : undefined;

		const targetCellPositionChanged = pluginState.targetCellPosition !== targetCellPosition;
		const closeContextualMenu = shouldCloseLegacyContextualMenu({
			pluginState,
			targetCellPositionChanged,
			tr,
		});

		if (!targetCellPositionChanged && !closeContextualMenu) {
			return pluginState;
		}

		// Close the legacy contextual menu when moving cells because the cell background
		// color submenu can otherwise remain open against the previous cell selection.
		return {
			...pluginState,
			...(closeContextualMenu ? { isContextualMenuOpen: false } : {}),
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
			if (expValEquals('platform_editor_table_menu_updates', 'isEnabled', true)) {
				const shouldClearTargetCellPosition = pluginState.targetCellPosition !== undefined;
				const hasActiveTableMenu =
					pluginState.activeTableMenu != null && pluginState.activeTableMenu.type !== 'none';

				if (!shouldClearTargetCellPosition && !hasActiveTableMenu) {
					return pluginState;
				}

				return {
					...pluginState,
					targetCellPosition: undefined,
					activeTableMenu: hasActiveTableMenu ? { type: 'none' } : pluginState.activeTableMenu,
				};
			}

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
