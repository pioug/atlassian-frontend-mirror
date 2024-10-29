import React from 'react';

import type InlineEdit from '@atlaskit/inline-edit';
import type { DatasourceType } from '@atlaskit/linking-types';

import { type DatasourceTypeWithOnlyValues } from '../types';

import TextEditType, { toTextValue } from './text';

// This is used in editor-card-plugin to identify if any type of inline edit is active.
const ACTIVE_INLINE_EDIT_ID = 'sllv-active-inline-edit';

export const editType = ({
	defaultValue,
	currentValue,
	setEditValues,
}: {
	defaultValue: DatasourceTypeWithOnlyValues;
	currentValue: DatasourceTypeWithOnlyValues;
	setEditValues: React.Dispatch<React.SetStateAction<DatasourceTypeWithOnlyValues>>;
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
		default:
			return { defaultValue: '', editView: () => <></> };
	}
};

export const isEditTypeSupported = (type: DatasourceType['type']) => {
	switch (type) {
		case 'string':
			return true;
		default:
			return false;
	}
};
