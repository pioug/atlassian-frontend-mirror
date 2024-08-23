import React, { type FC, useState } from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';

import InlineEdit from '../src';

const readViewContainerStyles = xcss({
	display: 'flex',
	maxWidth: '100%',
	wordBreak: 'break-word',
});

const ReadViewContainer: FC<{ children: string }> = ({ children }) => (
	<Box
		paddingBlockStart="space.150"
		paddingBlockEnd="space.300"
		padding="space.100"
		xcss={readViewContainerStyles}
		testId="read-view"
	>
		{children}
	</Box>
);

const editContainerStyles = xcss({
	width: '70%',
});

const InlineEditExample = () => {
	const initialValue = 'Inline edit field value';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600" xcss={editContainerStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Inline edit textarea + keep edit view open on blur"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }, ref) => (
					// @ts-ignore - textarea does not currently correctly pass through ref as a prop
					<TextArea {...fieldProps} ref={ref} />
				)}
				readView={() => <ReadViewContainer>{editValue || initialValue}</ReadViewContainer>}
				onConfirm={setEditValue}
				keepEditViewOpenOnBlur
				readViewFitContainerWidth
			/>
		</Box>
	);
};

export default InlineEditExample;
