import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useDatasourceItem } from '../../../state';
import { type DatasourceTypeWithOnlyValues } from '../types';
import { getIssueLinkData } from './get-issue-link-data';
import { getLinkedCellContent } from './get-linked-cell-content';
import { isIssueTypeColumnFn } from './is-issue-type-column-fn';
import { LinkedCellContentWrapped } from './linked-cell-content-wrapped';
import type { TableCellContentProps } from './table-cell-content-props';
import { TooltipWrapper } from './tooltip-wrapper';

export const ReadOnlyCell = ({
	id,
	columnType,
	wrappedColumnKeys = [],
	renderItem,
	columnKey,
}: TableCellContentProps): React.JSX.Element | null => {
	const rowData = useDatasourceItem({ id })?.data;
	if (!rowData || !columnKey || !rowData[columnKey]) {
		return null;
	}

	// Need to make sure we keep falsy values like 0 and '', as well as the boolean false.
	const value = rowData[columnKey]?.data;
	const values = Array.isArray(value) ? value : [value];

	const datasourceTypeWithValues = {
		type: columnType,
		values,
	} as DatasourceTypeWithOnlyValues;

	const isIssueTypeColumn = isIssueTypeColumnFn(columnKey);
	const issueLinkData = getIssueLinkData(rowData);

	return (
		<TooltipWrapper
			columnKey={columnKey}
			datasourceTypeWithValues={datasourceTypeWithValues}
			wrappedColumnKeys={wrappedColumnKeys}
		>
			{isIssueTypeColumn && issueLinkData ? (
				fg('electric_issue_like_table_xpc_url_wrapping') ? (
					<LinkedCellContentWrapped issueLinkData={issueLinkData}>
						{renderItem(datasourceTypeWithValues)}
					</LinkedCellContentWrapped>
				) : (
					getLinkedCellContent({
						children: renderItem(datasourceTypeWithValues),
						issueLinkData,
					})
				)
			) : (
				renderItem(datasourceTypeWithValues)
			)}
		</TooltipWrapper>
	);
};
