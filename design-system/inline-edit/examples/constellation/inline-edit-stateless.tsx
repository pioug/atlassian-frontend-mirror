import React, { useState } from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import InlineEdit from '../../src';

const containerStyles = xcss({
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingBlockEnd: 'space.600',
});

const readViewContainerStyles = xcss({
	display: 'flex',
	font: 'font.body',
	maxWidth: '100%',
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	wordBreak: 'break-word',
});

const InlineEditStatelessExample = () => {
	const initialValue = 'Initial description value';
	const [editValue, setEditValue] = useState('Default description value');
	const [isEditing, setEditing] = useState(true);

	return (
		<Box xcss={containerStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Description"
				editButtonLabel={editValue || initialValue}
				isEditing={isEditing}
				editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue}
					</Box>
				)}
				onCancel={() => setEditing(false)}
				onConfirm={(value: string) => {
					setEditValue(value);
					setEditing(false);
				}}
				onEdit={() => setEditing(true)}
			/>
		</Box>
	);
};

export default InlineEditStatelessExample;
