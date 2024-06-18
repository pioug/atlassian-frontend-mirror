/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type FC, type ReactNode, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import InlineEdit from '../src';

const readViewContainerStyles = css({
	margin: `${token('space.100', '8px')} ${token('space.0', '0px')}`,
});

const ReadViewContainer: FC<{ children: ReactNode }> = ({ children }) => (
	<div css={readViewContainerStyles}>{children}</div>
);

const messageStyles = css({
	margin: `${token('space.100', '8px')} ${token('space.0', '0px')}`,
	padding: token('space.100', '8px'),
	backgroundColor: token('color.background.danger.bold'),
	bordeRadius: '3px',
	color: token('color.text.inverse'),
});

const Message: FC<{ children: string }> = ({ children }) => (
	<div css={messageStyles}>{children}</div>
);

const headingOneStyles = css({
	fontSize: token('font.size.400', '24px'),
	fontWeight: token('font.weight.medium', '500'),
	lineHeight: 'inherit',
});

const HeadingOne: FC<{ children: string }> = ({ children }) => (
	<h1 css={headingOneStyles}>{children}</h1>
);

const textFieldStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
		margin: '-11px -4px',
		padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
		fontSize: token('font.size.400', '24px'),
	},
});

const wrapperStyles = css({
	padding: `${token('space.100', '8px')} ${token('space.100', '8px')} ${token(
		'space.600',
		'48px',
	)}`,
});

const InlineEditExample = () => {
	const [editValue, setEditValue] = useState('Field value');

	return (
		<div css={wrapperStyles}>
			<InlineEdit
				defaultValue={editValue}
				label="Inline edit"
				editView={({ errorMessage, ...fieldProps }) => (
					<Textfield {...fieldProps} autoFocus css={textFieldStyles} />
				)}
				readView={() => (
					<ReadViewContainer>
						<HeadingOne>{editValue || 'Click to enter value'}</HeadingOne>
					</ReadViewContainer>
				)}
				onConfirm={(value) => setEditValue(value)}
			/>

			<Message>Some content beneath a inline edit as a placeholder</Message>
		</div>
	);
};

export default InlineEditExample;
