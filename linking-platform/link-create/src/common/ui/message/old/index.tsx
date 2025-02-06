/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import SuccessIcon from '@atlaskit/icon/utility/check-circle';
import ErrorIcon from '@atlaskit/icon/utility/error';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

type MessageAppearance = 'default' | 'error' | 'valid';

type MessageProps = {
	id?: string;
	appearance?: MessageAppearance;
	testId?: string;
	children: ReactNode;
};

const messageStyles = xcss({
	display: 'flex',
	justifyContent: 'baseline',
	gap: 'space.050',
	font: token('font.body.UNSAFE_small'),
	marginBlockStart: 'space.050',
});

const messageAppearanceStyles = {
	default: xcss({
		color: 'color.text.subtlest',
	}),
	error: xcss({
		color: 'color.text.danger',
	}),
	valid: xcss({
		color: 'color.text.success',
	}),
};

const iconWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginInlineStart: token('space.025', '2px'),
	marginInlineEnd: token('space.025', '2px'),
});

const IconWrapper = ({ children }: { children: ReactNode }) => {
	return <span css={iconWrapperStyles}>{children}</span>;
};

const messageIcons: Partial<Record<MessageAppearance, JSX.Element>> = {
	error: <ErrorIcon color={token('color.text.danger', '#AE2A19')} label="error" />,
	valid: <SuccessIcon color={token('color.text.success', '#216E4E')} label="success" />,
};

export const MessageOld = ({ children, appearance = 'default', id, testId }: MessageProps) => {
	const icon = messageIcons[appearance];

	/**
	 * The wrapping span is necessary to preserve spaces between children.
	 * Otherwise the flex layout of the message will remove any whitespace
	 * between children.
	 *
	 * If the child is just a string, this is not required and we can use one
	 * less DOM element.
	 */
	const content = typeof children === 'string' ? children : <span>{children}</span>;

	return (
		<Box xcss={[messageStyles, messageAppearanceStyles[appearance]]} testId={testId} id={id}>
			{icon && <IconWrapper>{icon}</IconWrapper>}
			{content}
		</Box>
	);
};
