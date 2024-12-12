import React, { useState } from 'react';

import { InlineEditableTextfield } from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';

const InlineEditExample = () => {
	const initialValue = 'Enter text';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEditableTextfield
				testId="editable-text-field"
				defaultValue={editValue}
				label="Inline editable textfield"
				editButtonLabel={editValue || initialValue}
				onConfirm={(value) => setEditValue(value)}
				placeholder={initialValue}
				isCompact
			/>
		</Box>
	);
};
export default InlineEditExample;
