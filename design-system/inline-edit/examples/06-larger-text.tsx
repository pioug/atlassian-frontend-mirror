/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const readViewContainerStyles = xcss({
	font: 'font.heading.large',
	paddingBlock: 'space.100',
	paddingInline: 'space.075',
	wordBreak: 'break-word',
});

const textFieldStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		font: token('font.heading.large'),
	},
});

const InlineEditExample = () => {
	const initialValue = 'Initial Large text field value';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
			<InlineEdit
				defaultValue={editValue}
				label="Larger text inline edit"
				editButtonLabel={editValue || initialValue}
				onConfirm={(value) => setEditValue(value)}
				editView={(fieldProps) => <Textfield {...fieldProps} autoFocus css={textFieldStyles} />}
				readView={() => (
					<Box xcss={readViewContainerStyles} testId="read-view">
						{editValue || initialValue}
					</Box>
				)}
			/>
		</Box>
	);
};

export default InlineEditExample;
