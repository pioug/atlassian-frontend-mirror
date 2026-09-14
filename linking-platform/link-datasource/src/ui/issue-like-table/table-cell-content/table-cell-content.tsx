import React from 'react';

import { cssMap } from '@compiled/react';

import type {
	DatasourceDataResponseItem,
	DatasourceType,
	Link,
} from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled';

import { useDatasourceItem } from '../../../state';
import { useExecuteAtomicAction } from '../../../state/actions/useExecuteAtomicAction';
import { isEditTypeSelectable } from '../edit-type/isEditTypeSelectable';
import { isEditTypeSupported } from '../edit-type/isEditTypeSupported';
import { type DatasourceTypeWithOnlyValues, type TableViewPropsRenderType } from '../types';

import { getIssueLinkData } from './get-issue-link-data';
import { getLinkedCellContent } from './get-linked-cell-content';
import { InlineEdit } from './inline-edit';
import { isIssueTypeColumnFn } from './is-issue-type-column-fn';
import { LinkedCellContentWrapped } from './linked-cell-content-wrapped';
import { ReadOnlyCell } from './read-only-cell';
import type { TableCellContentProps } from './table-cell-content-props';
import { TooltipWrapper } from './tooltip-wrapper';

const styles = cssMap({
	readViewStyles: {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		width: '100%',
		alignContent: 'center',
	},
});

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
			>
				{!isEditable && isIssueTypeColumnFn(columnKey) && issueLinkData ? (
					fg('electric_issue_like_table_xpc_url_wrapping') ? (
						<LinkedCellContentWrapped issueLinkData={issueLinkData}>
							{renderItem(values)}
						</LinkedCellContentWrapped>
					) : (
						getLinkedCellContent({ children: renderItem(values), issueLinkData })
					)
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
					issueLinkData={getIssueLinkData(rowData)}
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
