import type { TableAttributes } from '@atlaskit/adf-schema';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createTable } from '@atlaskit/editor-tables/utils';

import { TABLE_MAX_WIDTH } from '../pm-plugins/table-resizing/utils';

type CreateTableOverrides = {
	tableWidth?: TableAttributes['width'] | 'inherit';
	layout?: TableAttributes['layout'];
};

export const createTableWithWidth =
	({
		isTableScalingEnabled,
		isTableAlignmentEnabled,
		isFullWidthModeEnabled,
		isCommentEditor,
		isChromelessEditor,
		isTableResizingEnabled,
		createTableProps,
	}: {
		isTableScalingEnabled?: boolean;
		isTableAlignmentEnabled?: boolean;
		isFullWidthModeEnabled?: boolean;
		isCommentEditor?: boolean;
		isChromelessEditor?: boolean;
		isTableResizingEnabled?: boolean;
		createTableProps?: {
			rowsCount?: number;
			colsCount?: number;
		};
	}) =>
	(schema: Schema) => {
		const attrsOverrides: CreateTableOverrides = {};
		if (isTableScalingEnabled && isFullWidthModeEnabled && !isCommentEditor) {
			attrsOverrides.tableWidth = TABLE_MAX_WIDTH;
		}
		if (isTableAlignmentEnabled && (isFullWidthModeEnabled || isCommentEditor)) {
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
