import type { TableAttributes } from '@atlaskit/adf-schema';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createTable } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { TABLE_MAX_WIDTH, TABLE_FULL_WIDTH } from '../table-resizing/utils/consts';
const NESTED_TABLE_DEFAULT_ROWS = 2;
const NESTED_TABLE_DEFAULT_COLS = 2;

type CreateTableOverrides = {
	colsCount?: number;
	layout?: TableAttributes['layout'];
	rowsCount?: number;
	tableWidth?: TableAttributes['width'] | 'inherit';
};

export const createTableWithWidth =
	({
		isTableScalingEnabled,
		isTableAlignmentEnabled,
		isFullWidthModeEnabled,
		isMaxWidthModeEnabled,
		isCommentEditor,
		isChromelessEditor,
		isTableResizingEnabled,
		isNestedTable,
		createTableProps,
	}: {
		createTableProps?: {
			colsCount?: number;
			rowsCount?: number;
		};
		isChromelessEditor?: boolean;
		isCommentEditor?: boolean;
		isFullWidthModeEnabled?: boolean;
		isMaxWidthModeEnabled?: boolean;
		isNestedTable?: boolean;
		isTableAlignmentEnabled?: boolean;
		isTableResizingEnabled?: boolean;
		isTableScalingEnabled?: boolean;
	}) =>
	(schema: Schema) => {
		const attrsOverrides: CreateTableOverrides = {};
		if (isNestedTable) {
			attrsOverrides.rowsCount = createTableProps?.rowsCount
				? createTableProps?.rowsCount
				: NESTED_TABLE_DEFAULT_ROWS;
			attrsOverrides.colsCount = createTableProps?.colsCount
				? createTableProps?.colsCount
				: NESTED_TABLE_DEFAULT_COLS;
		}
		if (isTableScalingEnabled && !isCommentEditor) {
			if (
				expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) &&
				isMaxWidthModeEnabled
			) {
				attrsOverrides.tableWidth = TABLE_MAX_WIDTH;
			} else if (isFullWidthModeEnabled) {
				attrsOverrides.tableWidth = TABLE_FULL_WIDTH;
			}
		}
		if (
			isTableAlignmentEnabled &&
			(isFullWidthModeEnabled ||
				(expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) &&
					isMaxWidthModeEnabled) ||
				isCommentEditor)
		) {
			attrsOverrides.layout = 'align-start';
		}
		if ((isCommentEditor && isTableResizingEnabled) || isChromelessEditor) {
			attrsOverrides.tableWidth = 'inherit';
		}

		return createTable({
			schema,
			...createTableProps,
			...attrsOverrides,
		});
	};
