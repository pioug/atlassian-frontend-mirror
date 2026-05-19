import React from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

import {
	type DatasourceDataResponseItem,
	type DatasourceType,
	type Link,
} from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import LinkUrl from '@atlaskit/smart-card/link-url';
import Tooltip from '@atlaskit/tooltip';

import { useDatasourceItem } from '../../../state';
import { useExecuteAtomicAction } from '../../../state/actions';
import { isEditTypeSelectable, isEditTypeSupported } from '../edit-type';
import { stringifyType } from '../render-type';
import { TruncateTextTag } from '../truncate-text-tag';
import { type DatasourceTypeWithOnlyValues, type TableViewPropsRenderType } from '../types';

import { InlineEdit } from './inline-edit';

interface TableCellContentProps {
	columnKey: string;
	columnTitle: string;
	columnType: DatasourceType['type'];
	id: string;
	/** Used to retrieve cell content from the store */
	renderItem: TableViewPropsRenderType;
	wrappedColumnKeys: string[] | undefined;
}

const styles = cssMap({
	readViewStyles: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		width: '100%',
		alignContent: 'center',
	},
});

const TooltipWrapper = ({
	columnKey,
	datasourceTypeWithValues: { type, values },
	wrappedColumnKeys,
	children,
}: {
	children: React.ReactNode;
	columnKey: string;
	datasourceTypeWithValues: DatasourceTypeWithOnlyValues;
	wrappedColumnKeys: string[] | undefined;
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

/**
 * Extracts the issue link (URL + text) from a row's `key` column data, if present.
 * Returns `undefined` when the row has no `key` data or the data has no URL,
 * so callers can treat the result as a simple "is this row linkable?" check.
 */
const getIssueLinkData = (rowData: DatasourceDataResponseItem): Link | undefined => {
	const keyData = rowData.key?.data as Link | undefined;
	return keyData?.url ? keyData : undefined;
};

/**
 * Wraps the given cell `children` in a `LinkUrl` pointing at the issue URL,
 * making the cell's contents (e.g. the issue type icon) act as a link to the
 * issue. If `issueLinkData` is missing, returns `children` unchanged so the
 * caller doesn't need to branch on linkability.
 */
const getLinkedCellContent = ({
	children,
	issueLinkData,
}: {
	children: React.ReactNode;
	issueLinkData?: Link;
}) => {
	if (!issueLinkData) {
		return children;
	}

	return (
		<LinkUrl
			href={issueLinkData.url}
			target="_blank"
			aria-label={issueLinkData.text || issueLinkData.url}
			data-testid={'issue-like-table-type-icon-link'}
		>
			{children}
		</LinkUrl>
	);
};

const isIssueTypeColumnFn = (columnKey: string) => {
	return columnKey === 'issuetype';
};

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

	if (fg('platform_lp_sllv_jira_type_as_link')) {
		const isIssueTypeColumn = isIssueTypeColumnFn(columnKey);
		const issueLinkData = getIssueLinkData(rowData);

		return (
			<TooltipWrapper
				columnKey={columnKey}
				datasourceTypeWithValues={datasourceTypeWithValues}
				wrappedColumnKeys={wrappedColumnKeys}
			>
				{isIssueTypeColumn && issueLinkData ? getLinkedCellContent({
					children: renderItem(datasourceTypeWithValues),
					issueLinkData,
				}) : renderItem(datasourceTypeWithValues)}
			</TooltipWrapper>
		);
	}

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
	ari,
	values,
	columnKey,
	columnTitle,
	renderItem,
	integrationKey,
	issueLinkData,
	wrappedColumnKeys,
}: {
	ari: string;
	columnKey: string;
	columnTitle: string;
	integrationKey: string;
	issueLinkData?: Link;
	renderItem: TableViewPropsRenderType;
	values: DatasourceTypeWithOnlyValues;
	wrappedColumnKeys: string[] | undefined;
}) => {
	// Callbacks are returned only when the ari is editable and the action schemas exist in the store
	const { execute, executeFetch } = useExecuteAtomicAction({
		ari,
		fieldKey: columnKey,
		integrationKey,
	});

	// A field is editable when `execute` is returned from the store
	const isEditable = !!execute;

	const readView = (
		<TooltipWrapper
			columnKey={columnKey}
			datasourceTypeWithValues={values}
			wrappedColumnKeys={wrappedColumnKeys}
		>
			<Box
				testId="inline-edit-read-view"
				paddingInline={isEditable ? 'space.075' : 'space.100'}
				paddingBlock="space.050"
				xcss={styles.readViewStyles}
				// minHeight here compensates for 2px from both top and bottom taken by InlneEdit (from transparent border in read-view mode and border+padding in edit view)
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ minHeight: 'calc(40px - 2px * 2)' }}
			>{fg('platform_lp_sllv_jira_type_as_link') ? (
				!isEditable && isIssueTypeColumnFn(columnKey) && issueLinkData ? getLinkedCellContent({
					children: renderItem(values),
					issueLinkData,
				}) : renderItem(values)
			) : (
				renderItem(values)
			)}
			</Box>
		</TooltipWrapper>
	);

	if (!isEditable) {
		return readView;
	}

	// if the field requires to fetch options to execute, then is editable only if `executeFetch` is defined
	if (isEditTypeSelectable(values.type) && !executeFetch) {
		return readView;
	}

	return (
		<InlineEdit
			ari={ari}
			execute={execute}
			executeFetch={executeFetch}
			readView={readView}
			columnKey={columnKey}
			columnTitle={columnTitle}
			datasourceTypeWithValues={values}
		/>
	);
};

const toDatasourceTypeWithValues = ({
	rowData,
	columnKey,
	columnType,
}: {
	columnKey: string;
	columnType: DatasourceType['type'];
	rowData: DatasourceDataResponseItem;
}) => {
	// Need to make sure we keep falsy values like 0 and '', as well as the boolean false.
	const value = rowData[columnKey]?.data;
	const values = !value ? [] : Array.isArray(value) ? value : [value];

	return {
		type: columnType,
		values,
	} as DatasourceTypeWithOnlyValues;
};

export const TableCellContent = ({
	id,
	columnKey,
	columnTitle,
	columnType,
	renderItem,
	wrappedColumnKeys,
}: TableCellContentProps): JSX.Element => {
	const item = useDatasourceItem({ id });

	if (item) {
		const { integrationKey, ari, data: rowData } = item;

		const isEditType = !!ari && !!integrationKey && isEditTypeSupported(columnType);

		if (isEditType) {
			return (
				<InlineEditableCell
					ari={ari}
					columnKey={columnKey}
					columnTitle={columnTitle}
					renderItem={renderItem}
					integrationKey={integrationKey}
					issueLinkData={
						fg('platform_lp_sllv_jira_type_as_link')
							? getIssueLinkData(rowData)
							: undefined
					}
					values={toDatasourceTypeWithValues({ rowData, columnKey, columnType })}
					wrappedColumnKeys={wrappedColumnKeys}
				/>
			);
		}
	}

	return (
		<Box
			testId="inline-edit-read-view"
			paddingInline="space.100"
			paddingBlock="space.050"
			xcss={styles.readViewStyles}
			// minHeight here compensates for 2px from both top and bottom taken by InlneEdit (from transparent border in read-view mode and border+padding in edit view)
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ minHeight: 'calc(40px - 2px * 2)' }}
		>
			<ReadOnlyCell
				id={id}
				columnKey={columnKey}
				columnTitle={columnTitle}
				columnType={columnType}
				wrappedColumnKeys={wrappedColumnKeys}
				renderItem={renderItem}
			/>
		</Box>
	);
};
