import React, { type FC, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';

const readViewContainerStyles = cssMap({
	root: {
		display: 'flex',
		maxWidth: '100%',
		wordBreak: 'break-word',
	},
});

const ReadViewContainer: FC<{ children: string }> = ({ children }) => (
	<Box
		paddingBlockStart="space.150"
		paddingBlockEnd="space.150"
		padding="space.100"
		xcss={readViewContainerStyles.root}
		testId="read-view"
	>
		{children}
	</Box>
);

const InlineEditExample = () => {
	const initialValue = 'Initial Field value';
	const [editValue, setEditValue] = useState('Field value');
	const [isEditing, setEditing] = useState(true);

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEdit
				defaultValue={editValue}
				label="Inline edit"
				editButtonLabel={editValue || initialValue}
				isEditing={isEditing}
				editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
				readView={() => <ReadViewContainer>{editValue || initialValue}</ReadViewContainer>}
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

export default InlineEditExample;
