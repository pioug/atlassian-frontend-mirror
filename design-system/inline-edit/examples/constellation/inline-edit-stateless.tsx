import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.600'),
	},
});

const readViewContainerStyles = cssMap({
	root: {
		display: 'flex',
		font: token('font.body'),
		maxWidth: '100%',
		paddingBlock: token('space.100'),
		paddingInline: token('space.075'),
		wordBreak: 'break-word',
	},
});

const InlineEditStatelessExample = () => {
	const initialValue = 'Initial description value';
	const [editValue, setEditValue] = useState('Default description value');
	const [isEditing, setEditing] = useState(true);

	return (
		<Box xcss={containerStyles.root}>
			<InlineEdit
				defaultValue={editValue}
				label="Description"
				editButtonLabel={editValue || initialValue}
				isEditing={isEditing}
				editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
				readView={() => (
					<Box xcss={readViewContainerStyles.root} testId="read-view">
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
