import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.600'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		width: '70%' as any,
	},
});

const readViewContainerStyles = cssMap({
	root: {
		font: token('font.body'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		minHeight: '4em' as any,
		paddingTop: token('space.075'),
		paddingRight: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
		wordBreak: 'break-word',
	},
});

const InlineEditExample = () => {
	const initialValue = 'Inline edit field value';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box xcss={containerStyles.root}>
			<InlineEdit
				defaultValue={editValue}
				label="Inline edit textarea + keep edit view open on blur"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }, ref) => (
					// @ts-ignore - textarea does not currently correctly pass through ref as a prop
					<TextArea {...fieldProps} ref={ref} />
				)}
				readView={() => (
					<Box xcss={readViewContainerStyles.root} testId="read-view">
						{editValue || initialValue}
					</Box>
				)}
				onConfirm={setEditValue}
				keepEditViewOpenOnBlur
				readViewFitContainerWidth
				testId="textarea-usage"
			/>
		</Box>
	);
};

export default InlineEditExample;
