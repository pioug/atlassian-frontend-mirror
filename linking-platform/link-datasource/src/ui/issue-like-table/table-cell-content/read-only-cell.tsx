import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useDatasourceItem } from '../../../state';
import { getIssueLinkData } from './get-issue-link-data';
import { getLinkedCellContent } from './get-linked-cell-content';
import { isIssueTypeColumnFn } from './is-issue-type-column-fn';
import { LinkedCellContentWrapped } from './linked-cell-content-wrapped';
import type { TableCellContentProps } from './table-cell-content-props';
import { toDatasourceTypeWithValues } from './to-datasource-type-with-values';
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

	const datasourceTypeWithValues = toDatasourceTypeWithValues({
		rowData,
		columnKey,
		columnType,
	});

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
