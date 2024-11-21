import React from 'react';

import type InlineEdit from '@atlaskit/inline-edit';
import type { DatasourceType } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { type ExecuteFetch } from '../../../state/actions';
import { type DatasourceTypeWithOnlyTypeValues, type DatasourceTypeWithOnlyValues } from '../types';

import IconEditType from './icon';
import StatusEditType from './status';
import TextEditType, { toTextValue } from './text';

// This is used in editor-card-plugin to identify if any type of inline edit is active.
const ACTIVE_INLINE_EDIT_ID = 'sllv-active-inline-edit';

export const editType = ({
	defaultValue,
	currentValue,
	setEditValues,
	executeFetch,
}: {
	defaultValue: DatasourceTypeWithOnlyValues;
	currentValue: DatasourceTypeWithOnlyValues;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
	executeFetch?: ExecuteFetch;
}): Pick<React.ComponentProps<typeof InlineEdit>, 'defaultValue' | 'editView'> => {
	switch (defaultValue.type) {
		case 'string':
			return {
				defaultValue: toTextValue(defaultValue),
				editView: ({ ...fieldProps }) => (
					<TextEditType
						{...fieldProps}
						currentValue={currentValue}
						setEditValues={setEditValues}
						id={ACTIVE_INLINE_EDIT_ID}
					/>
				),
			};
		case 'icon':
			return {
				defaultValue: toTextValue(defaultValue),
				editView: ({ value, ...fieldProps }) => (
					<IconEditType
						{...fieldProps}
						currentValue={currentValue as DatasourceTypeWithOnlyTypeValues<'icon'>}
						setEditValues={setEditValues}
						id={ACTIVE_INLINE_EDIT_ID}
						executeFetch={executeFetch}
					></IconEditType>
				),
			};
		case 'status':
			return {
				defaultValue: toTextValue(defaultValue),
				editView: ({ ...fieldProps }) => (
					<StatusEditType
						{...fieldProps}
						currentValue={currentValue}
						setEditValues={setEditValues}
						id={ACTIVE_INLINE_EDIT_ID}
						executeFetch={executeFetch}
					/>
				),
			};
	}
	return { defaultValue: '', editView: () => <></> };
};

export const isEditTypeSupported = (type: DatasourceType['type']) => {
	const supportedEditType = [
		'string',
		...(fg('platform-datasources-enable-two-way-sync-statuses') ? ['status'] : []),
		...(fg('platform-datasources-enable-two-way-sync-priority') ? ['icon'] : []),
	];
	return supportedEditType.includes(type);
};

export const isEditTypeSelectable = (type: DatasourceType['type']) => {
	const selectEditTypes = ['status', 'icon', 'user'];
	return selectEditTypes.includes(type);
};
