import type { TableAttributes } from '@atlaskit/adf-schema';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createTable } from '@atlaskit/editor-tables/utils';

import { TABLE_MAX_WIDTH } from '../pm-plugins/table-resizing/utils';

type CreateTableOverrides = {
	tableWidth?: TableAttributes['width'];
	layout?: TableAttributes['layout'];
};

export const createTableWithWidth =
	({
		isTableScalingEnabled,
		isTableAlignmentEnabled,
		isFullWidthModeEnabled,
		createTableProps,
	}: {
		isTableScalingEnabled?: boolean;
		isTableAlignmentEnabled?: boolean;
		isFullWidthModeEnabled?: boolean;
		createTableProps?: {
			rowsCount?: number;
			colsCount?: number;
		};
	}) =>
	(schema: Schema) => {
		const attrsOverrides: CreateTableOverrides = {};
		if (isTableScalingEnabled && isFullWidthModeEnabled) {
			attrsOverrides.tableWidth = TABLE_MAX_WIDTH;
		}
		if (isTableAlignmentEnabled && isFullWidthModeEnabled) {
			attrsOverrides.layout = 'align-start';
		}

		return createTable({
			schema,
			...createTableProps,
			...attrsOverrides,
		});
	};
