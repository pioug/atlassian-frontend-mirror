import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const readViewContainerStyles = cssMap({
	root: {
		font: token('font.body'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.075'),
		wordBreak: 'break-word',
	},
});

const InlineEditReactNodeLabelExample = (): React.JSX.Element => {
	const initialValue = 'Default team name value';
	const [editValue, setEditValue] = useState('Pyxis');

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEdit
				defaultValue={editValue}
				label={<>Team name ReactNode</>}
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage: _errorMessage, ...fieldProps }) => (
					<Textfield {...fieldProps} autoFocus />
				)}
				readView={() => (
					<Box xcss={readViewContainerStyles.root} testId="read-view">
						{editValue || initialValue}
					</Box>
				)}
				onConfirm={(value) => setEditValue(value)}
			/>
		</Box>
	);
};

export default InlineEditReactNodeLabelExample;
