import React, { type FC, useState } from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import InlineEdit from '../src';

const readViewContainerStyles = xcss({
	display: 'flex',
	maxWidth: '100%',
	wordBreak: 'break-word',
});

const ReadViewContainer: FC<{ children: string }> = ({ children }) => (
	<Box
		paddingBlockStart="space.150"
		paddingBlockEnd="space.150"
		padding="space.100"
		xcss={readViewContainerStyles}
		testId="read-view"
	>
		{children}
	</Box>
);

const InlineEditExample = () => {
	const initialValue = 'Basic Field value';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEdit
				testId="inline-edit"
				defaultValue={editValue}
				label="Inline edit"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }) => <Textfield {...fieldProps} autoFocus />}
				readView={() => <ReadViewContainer>{editValue || initialValue}</ReadViewContainer>}
				onConfirm={(value) => setEditValue(value)}
			/>
		</Box>
	);
};

export default InlineEditExample;
