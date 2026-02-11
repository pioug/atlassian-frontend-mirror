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
	const initialValue = 'Enter text';
	const [editValue, setEditValue] = useState('Default value');

	return (
		<Box padding="space.100">
			<InlineEdit
				defaultValue={editValue}
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }) => (
					// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
					<Textfield {...fieldProps} autoFocus css={textFieldStyles} />
				)}
				readView={() => (
					<Box xcss={readViewContainerStyles.root} testId="read-view">
						{editValue || initialValue}
					</Box>
				)}
				onConfirm={(value) => {
					setEditValue(value);
				}}
			/>
		</Box>
	);
};

export default InlineEditExample;
