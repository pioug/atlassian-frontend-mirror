import { TABLE_ACTION, ACTION_SUBJECT, EVENT_TYPE, MODE } from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload } from '../../analytics/events';

export const getWidthInfoPayload = (renderer: HTMLElement): AnalyticsEventPayload => {
	const tablesInfo: Array<{
		hasScrollbar: boolean;
		isNestedTable: boolean;
		tableWidth: number;
	}> = [];

	const tableWrappers = renderer.querySelectorAll<HTMLDivElement>('.pm-table-wrapper');

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

	return {
		action: TABLE_ACTION.TABLE_WIDTH_INFO,
		actionSubject: ACTION_SUBJECT.TABLE,
		attributes: {
			editorWidth: renderer.scrollWidth,
			tableWidthInfo: tablesInfo,
			mode: MODE.RENDERER,
		},
		eventType: EVENT_TYPE.OPERATIONAL,
	};
};
