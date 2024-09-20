import React from 'react';

import type InlineEdit from '@atlaskit/inline-edit';
import type { DatasourceType } from '@atlaskit/linking-types';

import { type DatasourceTypeWithOnlyValues } from '../types';

import TextEditType from './text';

// This is used in editor-card-plugin to identify if any type of inline edit is active.
const ACTIVE_INLINE_EDIT_ID = 'sllv-active-inline-edit';

export const editType = (
	item: DatasourceTypeWithOnlyValues,
): Pick<React.ComponentProps<typeof InlineEdit>, 'defaultValue' | 'editView'> => {
	switch (item.type) {
		case 'string':
			const stringValue = item.values?.[0] ?? '';
			return {
				defaultValue: stringValue,
				editView: ({ value, ...fieldProps }) => (
					<TextEditType {...fieldProps} value={value as string} id={ACTIVE_INLINE_EDIT_ID} />
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
