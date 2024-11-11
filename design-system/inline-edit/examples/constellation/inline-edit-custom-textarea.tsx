import React, { useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';

const containerStyles = xcss({
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingBlockEnd: 'space.600',
	width: '70%',
});

const readViewContainerStyles = xcss({
	font: 'font.body',
	minHeight: '4em',
	padding: 'space.075',
	wordBreak: 'break-word',
});

const InlineEditCustomTextareaExample = () => {
	const initialValue = 'Tell us about your experience';
	const [editValue, setEditValue] = useState('');
	return (
		<Box xcss={containerStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Send feedback"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }, ref) => (
					// @ts-ignore - textarea does not pass through ref as a prop
					<TextArea {...fieldProps} ref={ref} />
				)}
				readView={() => <Box xcss={readViewContainerStyles}>{editValue || initialValue}</Box>}
				onConfirm={setEditValue}
				keepEditViewOpenOnBlur
				readViewFitContainerWidth
			/>
		</Box>
	);
};

export default InlineEditCustomTextareaExample;
