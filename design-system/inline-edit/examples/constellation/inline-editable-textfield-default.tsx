import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

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
		<div
			style={{
				padding: `${token('space.100', '8px')} ${token(
					'space.100',
					'8px',
				)} ${token('space.600', '48px')}`,
			}}
		>
			<InlineEditableTextfield
				defaultValue={editValue}
				label="Description"
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				validate={validate}
			/>
		</div>
	);
};
export default InlineEditableTextfieldDefault;
