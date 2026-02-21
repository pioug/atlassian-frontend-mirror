/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { PropsWithChildren } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const buttonWrapperStyles = css({
	display: 'flex',
	gap: token('space.100', '8px'),
	flexWrap: 'wrap',
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.050', '4px'),
	paddingInlineEnd: token('space.050', '4px'),
	paddingInlineStart: token('space.050', '4px'),
});

export const ButtonWrapper: ({ children }: PropsWithChildren<{}>) => JSX.Element = ({
	children,
}: PropsWithChildren<{}>) => <div css={buttonWrapperStyles}>{children}</div>;
