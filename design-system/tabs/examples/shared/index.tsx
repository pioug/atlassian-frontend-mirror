/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const panelStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	flexGrow: 1,
	backgroundColor: token('color.background.neutral'),
	borderRadius: token('border.radius', '3px'),
	color: token('color.text.subtlest'),
	fontSize: '4em',
	fontWeight: token('font.weight.medium', '500'),
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.200', '16px'),
	paddingBlockEnd: token('space.400', '32px'),
	paddingBlockStart: token('space.400', '32px'),
	paddingInlineEnd: token('space.400', '32px'),
	paddingInlineStart: token('space.400', '32px'),
});

export const Panel = ({ children, testId }: { children: ReactNode; testId?: string }) => (
	<div css={panelStyles} data-testid={testId}>
		{children}
	</div>
);
