import React from 'react';

import type InlineEdit from '@atlaskit/inline-edit';
import type { DatasourceType } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { type ExecuteFetch } from '../../../state/actions';
import {
	type DatasourceTypeValueType,
	type DatasourceTypeWithOnlyTypeValues,
	type DatasourceTypeWithOnlyValues,
} from '../types';

import IconEditType from './icon';
import StatusEditType from './status';
import TextEditType from './text';
import UserEditType from './user';

// This is used in editor-card-plugin to identify if any type of inline edit is active.
const ACTIVE_INLINE_EDIT_ID = 'sllv-active-inline-edit';

export const editType = ({
	defaultValue,
	currentValue,
	labelId,
	setEditValues,
	executeFetch,
}: {
	currentValue: DatasourceTypeWithOnlyValues;
	defaultValue: DatasourceTypeWithOnlyValues;
	executeFetch?: ExecuteFetch;
	labelId?: string;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
}): Pick<React.ComponentProps<typeof InlineEdit>, 'defaultValue' | 'editView'> => {
	switch (defaultValue.type) {
		case 'string':
			return {
				defaultValue: toValueType<DatasourceTypeValueType<'string'>>(defaultValue) ?? '',
				editView: ({ ...fieldProps }) => (
					<TextEditType
						{...fieldProps}
						currentValue={currentValue as DatasourceTypeWithOnlyTypeValues<'string'>}
						setEditValues={setEditValues}
						id={ACTIVE_INLINE_EDIT_ID}
						labelId={labelId}
					/>
				),
			};
		case 'icon':
			return {
				defaultValue: toValueType<DatasourceTypeValueType<'icon'>>(defaultValue),
				editView: ({ value, ...fieldProps }) => (
					<IconEditType
						{...fieldProps}
						currentValue={currentValue as DatasourceTypeWithOnlyTypeValues<'icon'>}
						setEditValues={setEditValues}
						id={ACTIVE_INLINE_EDIT_ID}
						executeFetch={executeFetch}
						labelId={labelId}
					></IconEditType>
				),
			};
		case 'status':
			return {
				defaultValue: toValueType<DatasourceTypeValueType<'status'>>(defaultValue),
				editView: ({ ...fieldProps }) => (
					<StatusEditType
						{...fieldProps}
						currentValue={currentValue as DatasourceTypeWithOnlyTypeValues<'status'>}
						setEditValues={setEditValues}
						id={ACTIVE_INLINE_EDIT_ID}
						executeFetch={executeFetch}
						labelId={labelId}
					/>
				),
			};
		case 'user':
			const value = toValueType<DatasourceTypeValueType<'user'>>(defaultValue);
			return {
				defaultValue: value?.atlassianUserId ?? '',
				editView: ({ ...fieldProps }) => (
					<UserEditType
						{...fieldProps}
						currentValue={currentValue as DatasourceTypeWithOnlyTypeValues<'user'>}
						setEditValues={setEditValues}
						id={ACTIVE_INLINE_EDIT_ID}
						executeFetch={executeFetch}
						labelId={labelId}
					/>
				),
			};
	}
	return { defaultValue: '', editView: () => <></> };
};

export const isEditTypeSupported = (type: DatasourceType['type']) => {
	const supportedEditType = [
		'string',
		'status',
		'icon',
		...(fg('platform-datasources-enable-two-way-sync-assignee') ? ['user'] : []),
	];
	return supportedEditType.includes(type);
};

export const isEditTypeSelectable = (type: DatasourceType['type']) => {
	const selectEditTypes = ['status', 'icon', 'user'];
	return selectEditTypes.includes(type);
};

export const toValueType = <T,>(typeWithValues: DatasourceTypeWithOnlyValues) =>
	typeWithValues.values?.[0] as T;
