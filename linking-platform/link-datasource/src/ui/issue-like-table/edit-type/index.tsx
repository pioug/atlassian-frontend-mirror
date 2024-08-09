import React from 'react';

import type InlineEdit from '@atlaskit/inline-edit';
import type { DatasourceType } from '@atlaskit/linking-types';

import { type DatasourceTypeWithOnlyValues } from '../types';

import TextEditType from './text';

export const editType = (
	item: DatasourceTypeWithOnlyValues,
): Pick<React.ComponentProps<typeof InlineEdit>, 'defaultValue' | 'editView'> => {
	switch (item.type) {
		case 'string':
			const stringValue = item.values?.[0] ?? '';
			return {
				defaultValue: stringValue,
				editView: ({ value, ...fieldProps }) => (
					<TextEditType {...fieldProps} value={value as string} />
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
