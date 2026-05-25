import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables/utils';

import type { PluginInjectionAPI, TableSharedStateInternal } from '../../../types';
import { applyTableMeasurement } from '../../transforms/content-mode';

import { measureTableWithAutoLayout } from './measure-table-with-auto-layout';

/**
 * Used to measure a selected table width with it's content being laid out natively by the browser
 */
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

	const editorContainerWidth = api?.width?.sharedState.currentState()?.width;
	const measurement = measureTableWithAutoLayout(tableState.tableRef, editorContainerWidth);

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
