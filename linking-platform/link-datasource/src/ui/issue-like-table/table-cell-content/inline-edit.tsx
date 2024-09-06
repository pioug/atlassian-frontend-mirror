import React, { useCallback, useState } from 'react';

import AKInlineEdit from '@atlaskit/inline-edit';
import { type AtomicActionExecuteResponse } from '@atlaskit/linking-types';
import {
	type DatasourceDataResponseItem,
	type DatasourceType,
} from '@atlaskit/linking-types/datasource';
import { Box, xcss } from '@atlaskit/primitives';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { useDatasourceTableFlag } from '../../../hooks/useDatasourceTableFlag';
import { useDatasourceActions, useDatasourceItem } from '../../../state';
import { editType } from '../edit-type';
import type { DatasourceTypeWithOnlyValues } from '../types';

const editContainerStyles = xcss({
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
	const { entityType, integrationKey } = item || {};

	const { showErrorFlag } = useDatasourceTableFlag();

	const { onUpdateItem } = useDatasourceActions();

	const { fireEvent } = useDatasourceAnalyticsEvents();

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

			fireEvent('ui.form.submitted.inlineEdit', {});

			execute(value).catch((error) => {
				const status = error && typeof error === 'object' ? error.status : undefined;
				showErrorFlag({ status });
				onUpdateItem(ari, existingData);
			});
			setIsEditing(false);
		},
		[
			item,
			datasourceTypeWithValues.type,
			columnKey,
			onUpdateItem,
			ari,
			execute,
			fireEvent,
			showErrorFlag,
		],
	);

	const onEdit = useCallback(() => {
		setIsEditing(true);

		if (integrationKey && entityType) {
			fireEvent('ui.inlineEdit.clicked.datasource', {
				integrationKey,
				entityType,
				fieldKey: columnKey,
			});
		}
	}, [columnKey, entityType, fireEvent, integrationKey]);

	const onCancelEdit = useCallback(() => {
		setIsEditing(false);

		if (integrationKey && entityType) {
			fireEvent('ui.inlineEdit.cancelled.datasource', {
				integrationKey,
				entityType,
				fieldKey: columnKey,
			});
		}
	}, [columnKey, entityType, fireEvent, integrationKey]);

	return (
		<Box xcss={editContainerStyles}>
			<AKInlineEdit
				{...editType(datasourceTypeWithValues)}
				hideActionButtons
				readView={() => readView}
				readViewFitContainerWidth
				isEditing={isEditing}
				onEdit={onEdit}
				onCancel={onCancelEdit}
				onConfirm={onCommitUpdate}
			/>
		</Box>
	);
};
