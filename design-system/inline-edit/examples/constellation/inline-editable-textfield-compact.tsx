import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

const InlineEditableTextfieldCompactExample = () => {
	const placeholderLabel = 'Initial Team name value';
	const [editValue, setEditValue] = useState('Pyxis');

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
				label="Team name"
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				isCompact
			/>
		</div>
	);
};
export default InlineEditableTextfieldCompactExample;
