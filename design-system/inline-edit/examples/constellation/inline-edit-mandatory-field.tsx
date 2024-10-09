import React, { useState } from 'react';

import { Box } from '@atlaskit/primitives';

import { InlineEditableTextfield } from '../../src';

const InlineEditMandatoryFieldExample = () => {
	const placeholderLabel = 'Initial full name value';
	const [editValue, setEditValue] = useState('');

	return (
		<Box paddingInline="space.100" paddingBlockStart="space.100" paddingBlockEnd="space.600">
			<InlineEditableTextfield
				testId="editable-text-field"
				defaultValue={editValue}
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				isRequired
			/>
		</Box>
	);
};
export default InlineEditMandatoryFieldExample;
