import React, { useState } from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import InlineEdit from '../src';

const readViewContainerStyles = xcss({
	font: 'font.body',
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	wordBreak: 'break-word',
});

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
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue || initialValue}
					</Box>
				)}
				onConfirm={(value) => setEditValue(value)}
			/>
		</Box>
	);
};

export default InlineEditExample;
