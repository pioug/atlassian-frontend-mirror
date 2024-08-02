import React from 'react';

import { useIntl } from 'react-intl-next';

import { type DatasourceType } from '@atlaskit/linking-types';
import Tooltip from '@atlaskit/tooltip';

import { useDatasourceItem } from '../../../state';
import { stringifyType } from '../render-type';
import { TruncateTextTag } from '../truncate-text-tag';
import { type DatasourceTypeWithOnlyValues, type TableViewPropsRenderType } from '../types';

interface TableCellContentProps {
	id: string;
	columnKey: string | null;
	columnType: string;
	/** Used to retrieve cell content from the store */
	renderItem: TableViewPropsRenderType;
	wrappedColumnKeys: string[] | undefined;
}

export const TableCellContent = ({
	columnKey,
	columnType,
	id,
	renderItem,
	wrappedColumnKeys,
}: TableCellContentProps): JSX.Element => {
	const intl = useIntl();
	const rowData = useDatasourceItem({ id });
	if (!rowData || !columnKey || !rowData[columnKey]) {
		return <></>;
	}

	// Need to make sure we keep falsy values like 0 and '', as well as the boolean false.
	const value = rowData[columnKey]?.data;
	const values = Array.isArray(value) ? value : [value];

	const renderedValues = renderItem({
		type: columnType,
		values,
	} as DatasourceTypeWithOnlyValues);

	const stringifiedContent = values
		.map((value) =>
			stringifyType(
				{ type: columnType, value } as DatasourceType,
				intl.formatMessage,
				intl.formatDate,
			),
		)
		.filter((value) => value !== '')
		.join(', ');

	if (stringifiedContent && !wrappedColumnKeys?.includes(columnKey)) {
		return (
			<Tooltip
				// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
				tag={TruncateTextTag}
				content={stringifiedContent}
				testId="issues-table-cell-tooltip"
			>
				{renderedValues}
			</Tooltip>
		);
	}

	return <>{renderedValues}</>;
};
