import React from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { type DatasourceDataResponseItem, type DatasourceType } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';

import { useDatasourceItem } from '../../../state';
import { useExecuteAtomicAction } from '../../../state/actions';
import { isEditTypeSelectable, isEditTypeSupported } from '../edit-type';
import { stringifyType } from '../render-type';
import { TruncateTextTag } from '../truncate-text-tag';
import { type DatasourceTypeWithOnlyValues, type TableViewPropsRenderType } from '../types';

import { InlineEdit } from './inline-edit';
import { TableCellContentOld } from './table-cell-content-old';

interface TableCellContentProps {
	id: string;
	columnKey: string;
	columnTitle: string;
	columnType: DatasourceType['type'];
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

export const ReadOnlyCell = ({
	id,
	columnType,
	wrappedColumnKeys = [],
	renderItem,
	columnKey,
}: TableCellContentProps) => {
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
	wrappedColumnKeys,
}: {
	ari: string;
	columnKey: string;
	columnTitle: string;
	integrationKey: string;
	wrappedColumnKeys: string[] | undefined;
	values: DatasourceTypeWithOnlyValues;
	renderItem: TableViewPropsRenderType;
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
				{renderItem(values)}
			</Box>
		</TooltipWrapper>
	);

	if (!isEditable) {
		return readView;
	}

	// if the field requires to fetch options to execute, then is editable only if `executeFetch` is defined
	// `executeFetch` is returned only when ff:`enable_datasource_supporting_actions` is enabled
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
	rowData: DatasourceDataResponseItem;
	columnKey: string;
	columnType: DatasourceType['type'];
}) => {
	// Need to make sure we keep falsy values like 0 and '', as well as the boolean false.
	const value = rowData[columnKey]?.data;
	const values = !value ? [] : Array.isArray(value) ? value : [value];

	return {
		type: columnType,
		values,
	} as DatasourceTypeWithOnlyValues;
};

const TableCellContentNew = ({
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

export const TableCellContent = (props: TableCellContentProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <TableCellContentNew {...props} />;
	} else {
		return <TableCellContentOld {...props} />;
	}
};
