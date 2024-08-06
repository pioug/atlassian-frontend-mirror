import React from 'react';

import { useIntl } from 'react-intl-next';

import { type DatasourceType } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { useDatasourceItem } from '../../../state';
import { stringifyType } from '../render-type';
import { TruncateTextTag } from '../truncate-text-tag';
import { type DatasourceTypeWithOnlyValues, type TableViewPropsRenderType } from '../types';

interface TableCellContentProps {
	id: string;
	columnKey: string;
	columnType: DatasourceType['type'];
	/** Used to retrieve cell content from the store */
	renderItem: TableViewPropsRenderType;
	wrappedColumnKeys: string[] | undefined;
}

const truncateTextStyles = xcss({
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	width: '100%',
});

const TooltipWrapper = ({
	columnKey,
	datasourceTypeWithValues: { type, values },
	wrappedColumnKeys,
	children,
}: {
	columnKey: string;
	datasourceTypeWithValues: DatasourceTypeWithOnlyValues;
	wrappedColumnKeys: string[] | undefined;
	children: React.ReactNode;
}) => {
	const intl = useIntl();

	const stringifiedContent = values
		.map((value) =>
			stringifyType({ type, value } as DatasourceType, intl.formatMessage, intl.formatDate),
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
				{children}
			</Tooltip>
		);
	}

	return <>{children}</>;
};

const ReadOnlyCell = ({
	id,
	columnType,
	wrappedColumnKeys = [],
	renderItem,
	columnKey,
}: TableCellContentProps) => {
	const rowData = useDatasourceItem({ id });
	if (!rowData || !columnKey || !rowData[columnKey]) {
		return <></>;
	}

	// Need to make sure we keep falsy values like 0 and '', as well as the boolean false.
	const value = rowData[columnKey]?.data;
	const values = Array.isArray(value) ? value : [value];

	const datasourceTypeWithValues = {
		type: columnType,
		values,
	} as DatasourceTypeWithOnlyValues;

	return (
		<TooltipWrapper
			columnKey={columnKey}
			datasourceTypeWithValues={datasourceTypeWithValues}
			wrappedColumnKeys={wrappedColumnKeys}
		>
			{renderItem(datasourceTypeWithValues)}
		</TooltipWrapper>
	);
};

const InlineEditableCell = ({
	id,
	columnKey,
	columnType,
	renderItem,
	wrappedColumnKeys,
}: TableCellContentProps) => {
	const rowData = useDatasourceItem({ id });
	if (!rowData || !columnKey || !rowData[columnKey]) {
		return <></>;
	}

	// Need to make sure we keep falsy values like 0 and '', as well as the boolean false.
	const value = rowData[columnKey]?.data;
	const values = Array.isArray(value) ? value : [value];

	const datasourceTypeWithValues = {
		type: columnType,
		values,
	} as DatasourceTypeWithOnlyValues;

	return (
		<TooltipWrapper
			columnKey={columnKey}
			datasourceTypeWithValues={datasourceTypeWithValues}
			wrappedColumnKeys={wrappedColumnKeys}
		>
			<Box
				testId={'inline-edit-read-view'}
				paddingInline={'space.100'}
				paddingBlock={'space.050'}
				xcss={truncateTextStyles}
			>
				{renderItem(datasourceTypeWithValues)}
			</Box>
		</TooltipWrapper>
	);
};

export const TableCellContent = ({
	columnKey,
	columnType,
	id,
	renderItem,
	wrappedColumnKeys,
}: TableCellContentProps): JSX.Element => {
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	const renderedContent = fg('platform-datasources-enable-two-way-sync') ? (
		<InlineEditableCell
			id={id}
			columnKey={columnKey}
			columnType={columnType}
			renderItem={renderItem}
			wrappedColumnKeys={wrappedColumnKeys}
		/>
	) : (
		<ReadOnlyCell
			id={id}
			columnKey={columnKey}
			columnType={columnType}
			wrappedColumnKeys={wrappedColumnKeys}
			renderItem={renderItem}
		/>
	);

	return renderedContent;
};
