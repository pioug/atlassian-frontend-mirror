import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

const InlineEditRequiredFieldExample = () => {
	const placeholderLabel = 'Initial description value';
	const [editValue, setEditValue] = useState('Default description value');

	return (
		<div
			style={{
				padding: `${token('space.100', '8px')} ${token(
					'space.100',
					'8px',
				)} ${token('space.600', '48px')}`,
			}}
		>
			<InlineEditableTextfield
				testId="editable-text-field"
				defaultValue={editValue}
				label="Description"
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				isRequired
			/>
		</div>
	);
};
export default InlineEditRequiredFieldExample;
