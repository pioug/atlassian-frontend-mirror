import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

const InlineEditMandatoryFieldExample = () => {
	const placeholderLabel = 'Initial full name value';
	const [editValue, setEditValue] = useState('');

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
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				isRequired
			/>
		</div>
	);
};
export default InlineEditMandatoryFieldExample;
