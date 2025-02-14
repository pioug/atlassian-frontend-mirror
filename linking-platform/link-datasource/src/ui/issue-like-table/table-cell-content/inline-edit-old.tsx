import React, { useCallback, useMemo, useState } from 'react';

import { useIntl } from 'react-intl-next';

import AKInlineEdit from '@atlaskit/inline-edit';
import { type AtomicActionExecuteResponse } from '@atlaskit/linking-types';
import { type DatasourceDataResponseItem, type Link } from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';
import { useSmartLinkReload } from '@atlaskit/smart-card/hooks';

import { useDatasourceAnalyticsEvents } from '../../../analytics';
import { startUfoExperience } from '../../../analytics/ufoExperiences';
import { useDatasourceExperienceId } from '../../../contexts/datasource-experience-id';
import { useDatasourceTableFlag } from '../../../hooks/useDatasourceTableFlag';
import { type DatasourceItem, useDatasourceActions, useDatasourceItem } from '../../../state';
import { editType } from '../edit-type';
import { EmptyAvatar } from '../shared-components/avatar';
import type { DatasourceTypeWithOnlyValues } from '../types';
import { getFieldLabelById } from '../utils';

import { tableCellMessages } from './messages';

export const InlineEditUFOExperience = 'inline-edit-rendered';

const editContainerStyles = xcss({
	marginBlockStart: 'space.negative.100',
});

interface InlineEditProps {
	ari: string;
	columnKey: string;
	columnTitle: string;
	readView: React.ReactNode;
	datasourceTypeWithValues: DatasourceTypeWithOnlyValues;
	execute: (value: string | number) => Promise<AtomicActionExecuteResponse>;
	executeFetch?: <E>(inputs: any) => Promise<E>;
}

/**
 * @returns String of the new field value, or ID of status transition / atlassian user ID / priority ID.
 * @throws Error if the value is not supplied.
 */
export const newGetBackendUpdateValue = (typedNewValue: DatasourceTypeWithOnlyValues): string => {
	if (typedNewValue.values.length === 0) {
		throw new Error(
			`Datasource 2 way sync: Backend update value or value ID not supplied for type ${typedNewValue.type}`,
		);
	}
	switch (typedNewValue.type) {
		case 'string':
			return typedNewValue.values[0];
		case 'status':
			const { transitionId } = typedNewValue.values[0];
			if (transitionId === undefined || transitionId === '') {
				throw new Error(
					`Datasource 2 way sync: Backend status transition ID not supplied for type transition`,
				);
			}
			return transitionId;
		case 'user':
			const { atlassianUserId } = typedNewValue.values[0];
			if (atlassianUserId === undefined || atlassianUserId === '') {
				throw new Error(
					`Datasource 2 way sync: Backend atlasian user ID not supplied for type user`,
				);
			}
			return atlassianUserId;
		case 'icon':
			const { id } = typedNewValue.values[0];
			if (id === undefined || id === '') {
				throw new Error(`Datasource 2 way sync: Backend update ID not supplied for type icon`);
			}
			return id;
	}
	throw new Error(
		`Datasource 2 way sync Backend update value not implemented for type ${typedNewValue.type}`,
	);
};

const getBackendUpdateValue = (typedNewValue: DatasourceTypeWithOnlyValues): string | number => {
	switch (typedNewValue.type) {
		case 'string':
			return typedNewValue.values[0] || '';
		case 'status':
			return typedNewValue.values[0]?.transitionId || '';
		case 'user':
			return typedNewValue.values[0]?.atlassianUserId || '';
		case 'icon':
			return typedNewValue.values[0]?.id || '';
	}

	throw new Error(
		`Datasource 2 way sync Backend update value not implemented for type ${typedNewValue.type}`,
	);
};

const getCurrentFieldLabel = (typedNewValue: DatasourceTypeWithOnlyValues): string | number => {
	switch (typedNewValue.type) {
		case 'string':
			return typedNewValue.values[0] || '';
		case 'status':
			return typedNewValue.values[0]?.text || '';
		case 'user':
			return typedNewValue.values[0]?.displayName || '';
		case 'icon':
			return typedNewValue.values[0]?.text || '';
		default:
			return '';
	}
};

const mapUpdatedItem = (
	existingItem: DatasourceDataResponseItem,
	columnKey: string,
	newValue: DatasourceTypeWithOnlyValues,
): DatasourceDataResponseItem | null => {
	switch (newValue.type) {
		case 'string':
			return {
				...existingItem,
				[columnKey]: {
					data: newValue.values[0] || '',
				},
			};
		case 'status':
		case 'user':
		case 'icon':
			return newValue.values[0]
				? {
						...existingItem,
						[columnKey]: {
							data: newValue.values[0],
						},
					}
				: existingItem;
		default:
	}
	return null;
};

const isNewValue = (
	columnKey: string,
	newItem: DatasourceDataResponseItem,
	existingData: DatasourceDataResponseItem,
) => {
	return (
		newItem[columnKey]?.data &&
		(!existingData[columnKey]?.data || newItem[columnKey].data !== existingData[columnKey].data)
	);
};

const useRefreshDatasourceItem = (item: DatasourceItem | undefined) => {
	const url = (item?.data?.key?.data as Link)?.url;

	// passing empty string to the hook isn't ideal, but the alternatives are too much effort for this small fix.
	const reloadSmartLinkAction = useSmartLinkReload({
		url: url || '',
	});

	return useCallback(() => {
		if (url) {
			reloadSmartLinkAction();
		}
	}, [reloadSmartLinkAction, url]);
};

export const InlineEditOld = ({
	ari,
	execute,
	executeFetch,
	readView,
	columnKey,
	columnTitle,
	datasourceTypeWithValues,
}: InlineEditProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValues, setEditValues] =
		useState<DatasourceTypeWithOnlyValues>(datasourceTypeWithValues);

	const item = useDatasourceItem({ id: ari });
	const { entityType, integrationKey } = item || {};

	const { showErrorFlag } = useDatasourceTableFlag();

	const { onUpdateItem } = useDatasourceActions();

	const { fireEvent } = useDatasourceAnalyticsEvents();

	const refreshDatasourceItem = useRefreshDatasourceItem(item);

	const experienceId = useDatasourceExperienceId();

	const onCommitUpdate = useCallback(
		(newValue: DatasourceTypeWithOnlyValues) => {
			if (!item) {
				setIsEditing(false);
				return;
			}

			const existingData = item.data;

			const newItem = mapUpdatedItem(item.data, columnKey, newValue);

			if (!newItem || !isNewValue(columnKey, newItem, existingData)) {
				setIsEditing(false);
				return;
			}

			onUpdateItem(ari, newItem);

			fireEvent('ui.form.submitted.inlineEdit', {});

			let updateValue: string | undefined;

			if (fg('platform-datasources-inline-edit-id-checks')) {
				try {
					// TODO: Refactor types so that valid update values are guaranteed for
					// all object types. Invalid options should be filtered out of options -
					// this frontend error flag is a last resort.
					updateValue = newGetBackendUpdateValue(newValue);
				} catch {
					// Show an error as the new value that was going to be sent to the
					// backend is invalid (and would have failed anyway, silently to the user)
					showErrorFlag({});
					onUpdateItem(ari, existingData);
					setIsEditing(false);
					return;
				}
			}

			execute(
				updateValue !== undefined && fg('platform-datasources-inline-edit-id-checks')
					? updateValue
					: // Old behaviour is preserved in non-FFed path: errors thrown by getBackendUpdateValue are caught by
						// the error boundary, _not_ by the catch block & frontend flag here.
						getBackendUpdateValue(newValue),
			)
				.then(refreshDatasourceItem)
				.catch((error) => {
					const status = error && typeof error === 'object' ? error.status : undefined;
					showErrorFlag({ status });
					onUpdateItem(ari, existingData);
				});
			setIsEditing(false);
		},
		[item, columnKey, onUpdateItem, ari, refreshDatasourceItem, fireEvent, execute, showErrorFlag],
	);

	const onEdit = useCallback(() => {
		setIsEditing(true);

		if (experienceId) {
			startUfoExperience(
				{
					name: InlineEditUFOExperience,
				},
				experienceId,
			);
		}

		if (integrationKey && entityType) {
			fireEvent('ui.inlineEdit.clicked.datasource', {
				integrationKey,
				entityType,
				fieldKey: columnKey,
			});
		}
	}, [columnKey, entityType, experienceId, fireEvent, integrationKey]);

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

	const { formatMessage } = useIntl();

	const editButtonLabel = useMemo(() => {
		return formatMessage(tableCellMessages.editButtonLabel, {
			fieldName: columnTitle,
			fieldValue: getCurrentFieldLabel(editValues),
		});
	}, [columnTitle, formatMessage, editValues]);

	return (
		<Box xcss={editContainerStyles}>
			<AKInlineEdit
				{...editType({
					defaultValue: datasourceTypeWithValues,
					currentValue: editValues,
					setEditValues,
					executeFetch,
					labelId: getFieldLabelById(columnKey),
				})}
				hideActionButtons
				readView={editableRenderType({ defaultValue: datasourceTypeWithValues, readView })}
				readViewFitContainerWidth
				isEditing={isEditing}
				onEdit={onEdit}
				onCancel={onCancelEdit}
				onConfirm={() => onCommitUpdate(editValues)}
				editButtonLabel={editButtonLabel}
			/>
		</Box>
	);
};

/**
 *
 * This function allows us to manipulate the readView on editable cells.
 * This way, for example, we can show a fallback Avatar on empty user cells.
 *
 */
const editableRenderType = ({
	defaultValue,
	readView,
}: {
	defaultValue: DatasourceTypeWithOnlyValues;
	readView: React.ReactNode;
}) => {
	return () => {
		switch (defaultValue.type) {
			case 'user':
				if (!defaultValue.values?.[0]) {
					return <EmptyAvatar />;
				}
		}

		return readView;
	};
};
