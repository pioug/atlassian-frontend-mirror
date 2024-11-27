/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Heading from '@atlaskit/heading';
import InlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const messageStyles = xcss({
	borderRadius: 'border.radius',
});

const ReadViewContainer: FC<{ children: ReactNode }> = ({ children }) => (
	<Box paddingBlock="space.100" paddingInline="space.075" testId="read-view">
		{children}
	</Box>
);

const Message: FC<{ children: string }> = ({ children }) => (
	<Box
		backgroundColor="color.background.danger.bold"
		xcss={messageStyles}
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			color: token('color.text.inverse'),
		}}
		padding="space.100"
		id="description-message"
	>
		{children}
	</Box>
);

const HeadingOne: FC<{ children: string }> = ({ children }) => (
	<Heading size="large" as="h1">
		{children}
	</Heading>
);

const textFieldStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		font: token('font.heading.large'),
	},
});

const InlineEditExample = () => {
	const initialValue = 'Click to enter value';
	const [editValue, setEditValue] = useState('Field value');

	return (
		<Box
			paddingInlineStart="space.100"
			paddingInlineEnd="space.100"
			paddingBlockStart="space.100"
			paddingBlockEnd="space.600"
		>
			<InlineEdit
				defaultValue={editValue}
				label="Inline edit"
				editButtonLabel={editValue || initialValue}
				editView={({ errorMessage, ...fieldProps }) => (
					<Textfield
						{...fieldProps}
						autoFocus
						// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
						css={textFieldStyles}
						aria-describedby="description-message"
					/>
				)}
				readView={() => (
					<ReadViewContainer>
						<HeadingOne>{editValue || initialValue}</HeadingOne>
					</ReadViewContainer>
				)}
				onConfirm={(value) => setEditValue(value)}
			/>

			<Message>Some content beneath a inline edit as a placeholder</Message>
		</Box>
	);
};

export default InlineEditExample;
