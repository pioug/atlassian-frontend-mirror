import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import { hasTableBeenResized } from '@atlaskit/editor-common/table';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { PluginInjectionAPI } from '../../../types';
import {
	type TableMeasurement,
	applyTableMeasurement,
	getTableMeasurement,
} from '../../transforms/content-mode';

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
		if (node.type !== table || (hasTableBeenResized(node) && node.attrs.layout !== 'align-start')) {
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
