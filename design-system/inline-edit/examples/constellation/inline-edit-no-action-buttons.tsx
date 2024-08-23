import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';

import { InlineEditableTextfield } from '../../src';

const InlineEditNoActionsExample = () => {
	const placeholderLabel = 'Initial postcode value';
	const [editValue, setEditValue] = useState('94538');

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
				label="Postcode"
				editButtonLabel={editValue || placeholderLabel}
				onConfirm={(value) => setEditValue(value)}
				placeholder={placeholderLabel}
				hideActionButtons
			/>
		</div>
	);
};
export default InlineEditNoActionsExample;
