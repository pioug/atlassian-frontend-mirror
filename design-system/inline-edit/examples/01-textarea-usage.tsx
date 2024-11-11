import React, { useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';

const containerStyles = xcss({
	paddingInlineStart: 'space.100',
	paddingInlineEnd: 'space.600',
	width: '70%',
});

const readViewContainerStyles = xcss({
	font: 'font.body',
	minHeight: '4em',
	padding: 'space.075',
	wordBreak: 'break-word',
});

const InlineEditExample = () => {
	const initialValue = 'Inline edit field value';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box xcss={containerStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Inline edit textarea + keep edit view open on blur"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }, ref) => (
					// @ts-ignore - textarea does not currently correctly pass through ref as a prop
					<TextArea {...fieldProps} ref={ref} />
				)}
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue || initialValue}
					</Box>
				)}
				onConfirm={setEditValue}
				keepEditViewOpenOnBlur
				readViewFitContainerWidth
			/>
		</Box>
	);
};

export default InlineEditExample;
