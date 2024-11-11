import React, { useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

/*
  As inline edit allows for a custom input component, styling of `ReadViewContainer` needs to be shipped with the component.
  This keeps `editView` and `readView` components aligned when switching between the two. In this particular case, these
  styles ensure `readView` is in sync with the TextField.
  */
const readViewContainerStyles = xcss({
	font: 'font.body',
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	wordBreak: 'break-word',
});

const InlineEditDefaultExample = () => {
	const initialValue = 'Default team name value';
	const [editValue, setEditValue] = useState('Pyxis');

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEdit
				defaultValue={editValue}
				label="Team name"
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

export default InlineEditDefaultExample;
