import React, { useState } from 'react';

import { Box } from '@atlaskit/primitives';

import { InlineEditableTextfield } from '../../src';

const InlineEditNoActionsExample = () => {
	const placeholderLabel = 'Initial postcode value';
	const [editValue, setEditValue] = useState('94538');

	return (
		<Box paddingInline="space.100" paddingBlockStart="space.100" paddingBlockEnd="space.600">
			<InlineEditableTextfield
				testId="editable-text-field"
				defaultValue={editValue}
				label="Postcode"
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				hideActionButtons
			/>
		</Box>
	);
};
export default InlineEditNoActionsExample;
