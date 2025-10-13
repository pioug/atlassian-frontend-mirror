import { TABLE_ACTION, ACTION_SUBJECT, EVENT_TYPE, MODE } from '@atlaskit/editor-common/analytics';
import { getBreakpointKey } from '@atlaskit/editor-common/utils/analytics';

import type { AnalyticsEventPayload } from '../../analytics/events';

export const getWidthInfoPayload = (renderer: HTMLElement): AnalyticsEventPayload | undefined => {
	const tablesInfo: Array<{
		hasScrollbar: boolean;
		isNestedTable: boolean;
		tableWidth: number;
	}> = [];

	const tableWrappers = renderer.querySelectorAll<HTMLDivElement>('.pm-table-wrapper');

	// only send the event if there are tables on the page
	if (tableWrappers.length === 0) {
		return undefined;
	}

	tableWrappers.forEach((tableWrapper) => {
		const table = tableWrapper.querySelector(':scope > table');

		if (table) {
			const isNestedTable = Boolean(table.closest('td, th'));

			tablesInfo.push({
				tableWidth: table.scrollWidth,
				hasScrollbar: tableWrapper.clientWidth < table.scrollWidth,
				isNestedTable,
			});
		}
	});

	const maxTableWidth = Math.max(...tablesInfo.map((table) => table.tableWidth));
	const editorWidth = renderer.scrollWidth;

	return {
		action: TABLE_ACTION.TABLE_WIDTH_INFO,
		actionSubject: ACTION_SUBJECT.TABLE,
		attributes: {
			editorWidth,
			editorWidthBreakpoint: getBreakpointKey(editorWidth),
			tableWidthInfo: tablesInfo,
			maxTableWidthBreakpoint: getBreakpointKey(maxTableWidth),
			hasTableWiderThanEditor: maxTableWidth > editorWidth,
			hasTableWithScrollbar: tablesInfo.some((table) => table.hasScrollbar),
			mode: MODE.RENDERER,
		},
		eventType: EVENT_TYPE.OPERATIONAL,
	};
};
