import React, { useState } from 'react';

import { Box } from '@atlaskit/primitives';

import { InlineEditableTextfield } from '../src';

const InlineEditExample = () => {
	const [editValue, setEditValue] = useState('Field value');

	const validate = (value: string) => {
		if (value.length <= 6) {
			return 'Enter a value longer than 6 characters';
		}
		return undefined;
	};

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEditableTextfield
				defaultValue={editValue}
				label="Inline editable textfield"
				editButtonLabel={editValue}
				onConfirm={(value) => setEditValue(value)}
				placeholder="Click to enter text"
				validate={validate}
			/>
		</Box>
	);
};
export default InlineEditExample;
