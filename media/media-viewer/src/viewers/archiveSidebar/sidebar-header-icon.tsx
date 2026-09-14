/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

import type { Children } from './styleWrappers';

const sidebarHeaderIconStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginRight: token('space.100'),
	flexShrink: 0,
});

export const SidebarHeaderIcon = ({ children }: Children): JSX.Element => {
	return <div css={sidebarHeaderIconStyles}>{children}</div>;
};
