import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.600'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		width: '70%' as any,
	},
});

const readViewContainerStyles = cssMap({
	root: {
		font: token('font.body'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		minHeight: '4em' as any,
		padding: token('space.075'),
		wordBreak: 'break-word',
	},
});

const InlineEditCustomTextareaExample = () => {
	const initialValue = 'Tell us about your experience';
	const [editValue, setEditValue] = useState('');
	return (
		<Box xcss={containerStyles.root}>
			<InlineEdit
				defaultValue={editValue}
				label="Send feedback"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }, ref) => (
					// @ts-ignore - textarea does not pass through ref as a prop
					<TextArea {...fieldProps} ref={ref} />
				)}
				readView={() => <Box xcss={readViewContainerStyles.root}>{editValue || initialValue}</Box>}
				onConfirm={setEditValue}
				keepEditViewOpenOnBlur
				readViewFitContainerWidth
			/>
		</Box>
	);
};

export default InlineEditCustomTextareaExample;
