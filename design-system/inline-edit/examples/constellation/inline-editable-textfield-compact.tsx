import React, { useState } from 'react';

import { InlineEditableTextfield } from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives';

const InlineEditableTextfieldCompactExample = () => {
	const placeholderLabel = 'Initial Team name value';
	const [editValue, setEditValue] = useState('Pyxis');

	return (
		<Box paddingInline="space.100" paddingBlockStart="space.100" paddingBlockEnd="space.600">
			<InlineEditableTextfield
				testId="editable-text-field"
				defaultValue={editValue}
				label="Team name"
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				isCompact
			/>
		</Box>
	);
};
export default InlineEditableTextfieldCompactExample;
