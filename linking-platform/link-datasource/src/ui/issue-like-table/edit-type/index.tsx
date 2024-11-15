import React from 'react';

import type InlineEdit from '@atlaskit/inline-edit';
import type { DatasourceType } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { type DatasourceTypeWithOnlyValues } from '../types';

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
	executeFetch?: <E>(inputs: any) => Promise<E>;
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
		default:
			return { defaultValue: '', editView: () => <></> };
	}
};

export const isEditTypeSupported = (type: DatasourceType['type']) => {
	const supportedEditType = fg('platform-datasources-enable-two-way-sync-statuses')
		? ['string', 'status']
		: ['string'];
	return supportedEditType.includes(type);
};

export const isEditTypeSelectable = (type: DatasourceType['type']) => {
	const selectEditTypes = ['status', 'icon', 'user'];
	return selectEditTypes.includes(type);
};
