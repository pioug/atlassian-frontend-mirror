/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { PropsWithChildren } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const buttonWrapperStyles = css({
	display: 'flex',
	gap: token('space.100'),
	flexWrap: 'wrap',
	paddingBlockEnd: token('space.050'),
	paddingBlockStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	paddingInlineStart: token('space.050'),
});

export const ButtonWrapper: ({ children }: PropsWithChildren<{}>) => JSX.Element = ({
	children,
}: PropsWithChildren<{}>) => <div css={buttonWrapperStyles}>{children}</div>;
