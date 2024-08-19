import React, { useCallback, useState } from 'react';

import AKInlineEdit from '@atlaskit/inline-edit';
import { type AtomicActionExecuteResponse } from '@atlaskit/linking-types';
import {
	type DatasourceDataResponseItem,
	type DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { Box, xcss } from '@atlaskit/primitives';

import { getResourceUrl } from '../../../common/utils/response-item';
import { useDatasourceTableFlag } from '../../../hooks/useDatasourceTableFlag';
import { useDatasourceActions, useDatasourceItem } from '../../../state';
import { editType } from '../edit-type';
import type { DatasourceTypeWithOnlyValues } from '../types';

const containerStyles = xcss({
	marginBlockStart: 'space.negative.100',
});

interface InlineEditProps {
	ari: string;
	columnKey: string;
	readView: React.ReactNode;
	datasourceTypeWithValues: DatasourceTypeWithOnlyValues;
	execute: (value: string | number) => Promise<AtomicActionExecuteResponse>;
}

const mapUpdatedItem = (
	type: DatasourceType['type'],
	existingItem: DatasourceDataResponseItem,
	columnKey: string,
	newValue: string,
): DatasourceDataResponseItem | null => {
	switch (type) {
		case 'string':
			return {
				...existingItem,
				[columnKey]: {
					data: newValue,
				},
			};
		default:
	}
	return null;
};

const isNewValue = (
	columnKey: string,
	newItem: DatasourceDataResponseItem,
	existingData: DatasourceDataResponseItem,
) => {
	return newItem[columnKey].data && newItem[columnKey].data !== existingData[columnKey].data;
};

export const InlineEdit = ({
	ari,
	execute,
	readView,
	columnKey,
	datasourceTypeWithValues,
}: InlineEditProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const item = useDatasourceItem({ id: ari });

	const url = getResourceUrl(item?.data);
	const { showErrorFlag } = useDatasourceTableFlag({ url });

	const { onUpdateItem } = useDatasourceActions();

	const onCommitUpdate = useCallback(
		(value: string) => {
			if (!item) {
				setIsEditing(false);
				return;
			}
			const existingData = item.data;

			const newItem = mapUpdatedItem(datasourceTypeWithValues.type, item.data, columnKey, value);

			if (!newItem || !isNewValue(columnKey, newItem, existingData)) {
				setIsEditing(false);
				return;
			}

			onUpdateItem(ari, newItem);

			execute(value).catch((error) => {
				showErrorFlag();
				onUpdateItem(ari, existingData);
			});
			setIsEditing(false);
		},
		[ari, execute, datasourceTypeWithValues, item, columnKey, onUpdateItem, showErrorFlag],
	);

	return (
		<Box xcss={containerStyles}>
			<AKInlineEdit
				{...editType(datasourceTypeWithValues)}
				hideActionButtons
				readView={() => readView}
				readViewFitContainerWidth
				isEditing={isEditing}
				onEdit={() => setIsEditing(true)}
				onCancel={() => setIsEditing(false)}
				onConfirm={onCommitUpdate}
			/>
		</Box>
	);
};
