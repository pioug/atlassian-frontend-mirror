/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const actionStyles = css({
	maxWidth: '100%',
	flex: '0 0 auto',
	marginBlockEnd: token('space.100'),
	marginInlineStart: 'auto',
	paddingInlineStart: token('space.400'),
	whiteSpace: 'nowrap',
});

/**
 * __Actions wrapper__.
 *
 * An actions wrapper is a wrapper for the actions, which appear on the top right of the PageHeader component.
 *
 */
const ActionsWrapper: ({ children }: { children: ReactNode }) => JSX.Element = ({
	children,
}: {
	children: ReactNode;
}) => {
	return <div css={actionStyles}>{children}</div>;
};

export default ActionsWrapper;
