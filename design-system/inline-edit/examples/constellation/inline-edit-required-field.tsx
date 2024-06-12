import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

const InlineEditRequiredFieldExample = () => {
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
				label="Description"
				onConfirm={(value) => setEditValue(value)}
				placeholder="Add a description"
				isRequired
			/>
		</div>
	);
};
export default InlineEditRequiredFieldExample;
