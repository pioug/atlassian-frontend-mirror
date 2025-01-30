/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { Width } from '../index';
const containerStyles = css({
	// TODO (AFB-874): Disabling due to fixing for expand-spacing-property produces further ESLint errors
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	margin: `${token('space.600', '48px')} auto`,
	textAlign: 'center',
});
/* Use max-width so the component can shrink on smaller viewports. */
const wideContainerStyles = css({
	maxWidth: '464px',
});
const narrowContainerStyles = css({
	maxWidth: '304px',
});

type ContainerProps = {
	testId?: string;
	width: Width;
	children: ReactNode;
};

/**
 * __Container__
 *
 * Upper level container for Empty State.
 *
 * @internal
 */
const Container: FC<ContainerProps> = ({ children, width, testId }) => (
	<div
		data-testid={testId}
		css={[containerStyles, width === 'narrow' ? narrowContainerStyles : wideContainerStyles]}
	>
		{children}
	</div>
);

export default Container;
