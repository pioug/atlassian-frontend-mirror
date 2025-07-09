/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import SuccessIcon from '@atlaskit/icon/core/check-circle';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	message: {
		display: 'flex',
		justifyContent: 'baseline',
		gap: token('space.050'),
		font: token('font.body.UNSAFE_small'),
		marginBlockStart: token('space.050'),
	},
});

type MessageAppearance = 'default' | 'error' | 'valid';

type MessageProps = {
	id?: string;
	appearance?: MessageAppearance;
	testId?: string;
	children: ReactNode;
};

const messageAppearanceStyles = cssMap({
	default: {
		color: token('color.text.subtlest'),
	},
	error: {
		color: token('color.text.danger'),
	},
	valid: {
		color: token('color.text.success'),
	},
});

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
	error: (
		<StatusErrorIcon color={token('color.text.danger', '#AE2A19')} label="error" size="small" />
	),
	valid: (
		<SuccessIcon color={token('color.text.success', '#216E4E')} label="success" size="small" />
	),
};

export const Message = ({ children, appearance = 'default', id, testId }: MessageProps) => {
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
		<Box xcss={cx(styles.message, messageAppearanceStyles[appearance])} testId={testId} id={id}>
			{icon && <IconWrapper>{icon}</IconWrapper>}
			{content}
		</Box>
	);
};
