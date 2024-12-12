import React, { useState } from 'react';

import { InlineEditableTextfield } from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';

const InlineEditableTextfieldDefault = () => {
	const placeholderLabel = 'Initial description value';
	const [editValue, setEditValue] = useState('Default description value');

	const validate = (value: string) => {
		if (value.length <= 6) {
			return 'Please enter a description longer than 6 characters';
		}
		return undefined;
	};

	return (
		<Box paddingInline="space.100" paddingBlockStart="space.100" paddingBlockEnd="space.600">
			<InlineEditableTextfield
				defaultValue={editValue}
				label="Description"
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				validate={validate}
			/>
		</Box>
	);
};
export default InlineEditableTextfieldDefault;
