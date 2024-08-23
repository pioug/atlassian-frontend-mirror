/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const readViewContainerStyles = xcss({
	display: 'flex',
	maxWidth: '100%',
	wordBreak: 'break-word',
});

const ReadViewContainer: FC<{ children: string }> = ({ children }) => (
	<Box
		paddingBlockStart="space.150"
		paddingBlockEnd="space.150"
		padding="space.100"
		xcss={readViewContainerStyles}
		testId="read-view"
	>
		{children}
	</Box>
);

const wrapperStyles = xcss({
	font: token('font.heading.large'),
});

const textFieldStyles = css({
	fontSize: 'inherit',
	fontWeight: 'inherit',
	lineHeight: 'inherit',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		fontSize: 'inherit',
		fontWeight: 'inherit',
		lineHeight: 'inherit',
	},
});

const InlineEditExample = () => {
	const initialValue = 'Initial Large text field value';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box padding="space.100" xcss={wrapperStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Larger text inline edit"
				editButtonLabel={editValue || initialValue}
				onConfirm={(value) => setEditValue(value)}
				editView={(fieldProps) => <Textfield {...fieldProps} autoFocus css={textFieldStyles} />}
				readView={() => <ReadViewContainer>{editValue || initialValue}</ReadViewContainer>}
			/>
		</Box>
	);
};

export default InlineEditExample;
