/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const outerStyles = css({
	marginBlockEnd: token('space.200'),
	marginBlockStart: token('space.300'),
	marginInlineEnd: 0,
	marginInlineStart: 0,
});

/**
 * __Outer wrapper__.
 *
 * An outer wrapper that is the outermost component of the PageHeader component. It wraps around the PageHeader, its Actions,
 * the BottomBar and its Breadcrumbs.
 *
 */
const OuterWrapper: ({ children }: { children: ReactNode }) => JSX.Element = ({
	children,
}: {
	children: ReactNode;
}) => {
	return <div css={outerStyles}>{children}</div>;
};

export default OuterWrapper;
