import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import { fg } from '@atlaskit/platform-feature-flags';

import { type TableMeasurement, getTableMeasurement } from '../../transforms/content-mode';

import { restoreResizerContainer, runSmartAdjust } from './smart-adjust/run-smart-adjust';

export const measureTableWithAutoLayout = (
	tableRef: HTMLTableElement,
	editorContainerWidth?: number,
): TableMeasurement => {
	const cols = Array.from(tableRef.querySelectorAll<HTMLElement>(':scope > colgroup > col'));
	const contentWrap = tableRef.closest<HTMLElement>(
		`.${TableSharedCssClassName.TABLE_VIEW_CONTENT_WRAP}`,
	);
	const resizerContainer = contentWrap?.querySelector<HTMLElement>(
		`.${TableSharedCssClassName.TABLE_RESIZER_CONTAINER}`,
	);
	const resizerItem = resizerContainer?.querySelector<HTMLElement>('.resizer-item.display-handle');

	const prevTableWidth = tableRef.style.width;
	const prevTableLayout = tableRef.style.tableLayout;
	const prevColWidths = cols.map((col) => col.style.width);
	const prevResizerItemWidth = resizerItem?.style.width;

	tableRef.style.width = '';
	tableRef.style.tableLayout = 'auto';
	cols.forEach((col) => (col.style.width = ''));

	if (fg('platform_editor_table_fit_to_content_smart_adjust')) {
		const hadTableSticky = tableRef.classList.contains(TableSharedCssClassName.TABLE_STICKY);
		const prevTableMarginTop = tableRef.style.marginTop;
		if (hadTableSticky) {
			tableRef.classList.remove(TableSharedCssClassName.TABLE_NATIVE_STICKY);
		}
		if (prevTableMarginTop) {
			tableRef.style.marginTop = '';
		}

		const stickyRows = Array.from(
			tableRef.querySelectorAll<HTMLTableRowElement>(`tr.sticky, tr.${TableSharedCssClassName.TABLE_NATIVE_STICKY}`),
		);
		const prevStickyRowState = stickyRows.map((row) => ({
			row,
			hadSticky: row.classList.contains('sticky'),
			hadNative: row.classList.contains(TableSharedCssClassName.TABLE_NATIVE_STICKY),
			width: row.style.width,
			top: row.style.top,
			position: row.style.position,
			gridTemplateColumns: row.style.gridTemplateColumns,
		}));
		stickyRows.forEach((row) => {
			row.classList.remove('sticky');
			row.classList.remove(TableSharedCssClassName.TABLE_NATIVE_STICKY);
			row.style.width = '';
			row.style.top = '';
			row.style.position = '';
			row.style.gridTemplateColumns = '';
		});

		try {
			return runSmartAdjust(tableRef, resizerContainer, resizerItem, editorContainerWidth);
		} finally {
			tableRef.style.width = prevTableWidth;
			tableRef.style.tableLayout = prevTableLayout;
			cols.forEach((col, i) => (col.style.width = prevColWidths[i]));

			if (hadTableSticky) {
				tableRef.classList.add(TableSharedCssClassName.TABLE_STICKY);
			}
			if (prevTableMarginTop) {
				tableRef.style.marginTop = prevTableMarginTop;
			}
			prevStickyRowState.forEach((state) => {
				if (state.hadSticky) {
					state.row.classList.add('sticky');
				}
				if (state.hadNative) {
					state.row.classList.add(TableSharedCssClassName.TABLE_NATIVE_STICKY);
				}
				if (state.width) {
					state.row.style.width = state.width;
				}
				if (state.top) {
					state.row.style.top = state.top;
				}
				if (state.position) {
					state.row.style.position = state.position;
				}
				if (state.gridTemplateColumns) {
					state.row.style.gridTemplateColumns = state.gridTemplateColumns;
				}
			});

			restoreResizerContainer(resizerContainer);

			if (resizerItem) {
				resizerItem.style.width = prevResizerItemWidth ?? '';
			}
		}
	}

	if (resizerContainer) {
		resizerContainer.style.width = 'var(--ak-editor-table-width)';
		resizerContainer.style.setProperty('--ak-editor-table-width', 'max-content');
	}
	if (resizerItem) {
		resizerItem.style.width = 'max-content';
	}

	const measurement = getTableMeasurement(tableRef);

	tableRef.style.width = prevTableWidth;
	tableRef.style.tableLayout = prevTableLayout;
	cols.forEach((col, i) => (col.style.width = prevColWidths[i]));

	if (resizerItem) {
		resizerItem.style.width = prevResizerItemWidth ?? '';
	}

	return measurement;
};
