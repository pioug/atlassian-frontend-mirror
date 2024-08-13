import React, { useCallback, useState } from 'react';

import AKInlineEdit from '@atlaskit/inline-edit';
import {
	type DatasourceDataResponseItem,
	type DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { Box, xcss } from '@atlaskit/primitives';

import { useDatasourceActions, useDatasourceItem } from '../../../state';
import { useExecuteAtomicAction } from '../../../state/actions';
import { editType } from '../edit-type';
import type { DatasourceTypeWithOnlyValues } from '../types';

const containerStyles = xcss({
	marginBlockStart: 'space.negative.100',
});

interface InlineEditProps {
	ari: string;
	columnKey: string;
	datasourceTypeWithValues: DatasourceTypeWithOnlyValues;
	readView: React.ReactNode;
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

export const InlineEdit = ({
	ari,
	columnKey,
	datasourceTypeWithValues,
	readView,
}: InlineEditProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const item = useDatasourceItem({ id: ari });
	const { onUpdateItem } = useDatasourceActions();
	const { execute } = useExecuteAtomicAction({
		ari,
		fieldKey: columnKey,
		integrationKey: item?.integrationKey ?? '',
	});

	const onCommitUpdate = useCallback(
		(value: string) => {
			if (!execute || !item) {
				setIsEditing(false);
				return;
			}
			const existingData = item.data;
			const newItem = mapUpdatedItem(datasourceTypeWithValues.type, item.data, columnKey, value);
			if (!newItem) {
				setIsEditing(false);
				return;
			}
			onUpdateItem(ari, newItem);

			execute(value).catch((error) => {
				// eslint-disable-next-line no-console
				console.error(error);
				onUpdateItem(ari, existingData);
			});
			setIsEditing(false);
		},
		[ari, execute, datasourceTypeWithValues, item, columnKey, onUpdateItem],
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
