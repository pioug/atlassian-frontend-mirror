import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables/utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { PluginInjectionAPI, TableSharedStateInternal } from '../../types';
import { hasTableColumnBeenResized } from '../table-resizing/utils/colgroup';
import {
	type TableMeasurement,
	applyTableMeasurement,
	getTableMeasurement,
} from '../transforms/content-mode';

import { ALIGN_START } from './alignment';

type ContentModePluginOptions = {
	allowColumnResizing: boolean;
	allowTableResizing: boolean;
	isFullPageEditor: boolean;
};

export const isTableInContentMode = ({
	allowColumnResizing,
	allowTableResizing,
	isFullPageEditor,
	isTableNested,
	node,
}: ContentModePluginOptions & {
	isTableNested?: boolean;
	node?: PMNode;
}) => {
	if (
		!expValEqualsNoExposure('platform_editor_table_fit_to_content_auto_convert', 'isEnabled', true)
	) {
		return false;
	}

	if (!node || isTableNested) {
		return false;
	}

	return (
		isContentModeSupported({ allowColumnResizing, allowTableResizing, isFullPageEditor }) &&
		!hasTableBeenResized(node) &&
		node.attrs.layout === ALIGN_START
	);
};

export const isContentModeSupported = ({
	allowColumnResizing,
	allowTableResizing,
	isFullPageEditor,
}: ContentModePluginOptions) => {
	return allowColumnResizing && allowTableResizing && isFullPageEditor;
};

export const hasTableBeenResized = (node: PMNode): boolean =>
	node.attrs.width !== null || hasTableColumnBeenResized(node);

/**
 * Iterates all top-level tables in the document, and for those in content mode,
 * measures rendered column widths and sets colwidth + table width attributes
 * in a single batched transaction.
 */
export const applyMeasuredWidthToAllTables = (
	view: EditorView,
	pluginInjectionApi?: PluginInjectionAPI,
): void => {
	const {
		state: { doc, schema },
	} = view;
	let tr = view.state.tr;
	const { table } = schema.nodes;
	let modified = false;
	const measuredTables: Array<{
		measurement: TableMeasurement;
		node: PMNode;
		offset: number;
	}> = [];

	// modify only top-level tables
	doc.forEach((node, offset) => {
		if (node.type !== table || (hasTableBeenResized(node) && node.attrs.layout !== ALIGN_START)) {
			return;
		}

		const domNode = view.domAtPos(offset + 1).node;
		const tableWrapper =
			domNode instanceof HTMLElement
				? domNode.closest(`.${TableSharedCssClassName.TABLE_VIEW_CONTENT_WRAP}`)
				: null;
		const tableRef = tableWrapper?.querySelector<HTMLTableElement>('table');
		if (!tableRef) {
			return;
		}

		measuredTables.push({
			node,
			offset,
			measurement: getTableMeasurement(tableRef),
		});
	});

	measuredTables.forEach(({ node, offset, measurement }) => {
		tr = applyTableMeasurement(tr, node, measurement, offset);
		modified = true;
	});

	if (modified) {
		pluginInjectionApi?.analytics?.actions?.attachAnalyticsEvent({
			action: TABLE_ACTION.FIT_TO_CONTENT_AUTO_CONVERTED,
			actionSubject: ACTION_SUBJECT.TABLE,
			actionSubjectId: null,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				editorContainerWidth: pluginInjectionApi?.width?.sharedState.currentState()?.width ?? 0,
				totalTablesResized: measuredTables.length,
				measurements: measuredTables.map(({ measurement }) => ({
					tableWidth: measurement.tableWidth,
					totalColumnCount: measurement.colWidths.length,
				})),
			},
		})(tr);

		view.dispatch(tr.setMeta('addToHistory', false));
	}
};

export const applyMeasuredWidthToSelectedTable = (
	view: EditorView,
	api?: PluginInjectionAPI,
): void => {
	const tableObject = findTable(view.state.selection);
	if (!tableObject) {
		return;
	}

	const { node, pos } = tableObject;

	const tableState = api?.table.sharedState.currentState() as TableSharedStateInternal | undefined;

	if (!tableState?.tableRef) {
		return;
	}

	const tableRef = tableState.tableRef;

	// Instead of dispatching a transaction to "strip widths" and then waiting
	// for a rAF to measure natural column widths, instea directly update the DOM elements and
	// take a measurement.
	const cols = Array.from(tableRef.querySelectorAll<HTMLElement>(':scope > colgroup > col'));
	const contentWrap = tableRef.closest<HTMLElement>(
		`.${TableSharedCssClassName.TABLE_VIEW_CONTENT_WRAP}`,
	);
	const resizerContainer = contentWrap?.querySelector<HTMLElement>(
		`.${TableSharedCssClassName.TABLE_RESIZER_CONTAINER}`,
	);
	const resizerItem = resizerContainer?.querySelector<HTMLElement>('.resizer-item.display-handle');

	tableRef.style.width = '';
	tableRef.style.tableLayout = 'auto';
	cols.forEach((col) => (col.style.width = ''));

	if (resizerContainer) {
		resizerContainer.style.width = 'max-content';
		resizerContainer.style.setProperty('--ak-editor-table-width', 'max-content');
	}

	if (resizerItem) {
		resizerItem.style.width = 'max-content';
	}

	const measurement = getTableMeasurement(tableRef);

	const tr = applyTableMeasurement(view.state.tr, node, measurement, pos);

	api?.analytics?.actions?.attachAnalyticsEvent({
		action: TABLE_ACTION.FIT_TO_CONTENT_ON_DEMAND,
		actionSubject: ACTION_SUBJECT.TABLE,
		actionSubjectId: null,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			editorContainerWidth: api?.width?.sharedState.currentState()?.width ?? 0,
			tableWidth: measurement.tableWidth,
			totalColumnCount: measurement.colWidths.length,
		},
	})(tr);

	view.dispatch(tr);
};
