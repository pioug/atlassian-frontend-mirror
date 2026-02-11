/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const readViewContainerStyles = cssMap({
	root: {
		font: token('font.heading.large'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.075'),
		wordBreak: 'break-word',
	},
});

const textFieldStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		font: token('font.heading.large'),
	},
});

const InlineEditExample: () => JSX.Element = () => {
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
					<Box xcss={readViewContainerStyles.root} testId="read-view">
						{editValue || initialValue}
					</Box>
				)}
			/>
		</Box>
	);
};

export default InlineEditExample;
