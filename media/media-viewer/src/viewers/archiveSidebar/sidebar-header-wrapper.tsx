/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import type { Children } from './styleWrappers';

const sidebarHeaderWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	flexShrink: 0,
});

export const SidebarHeaderWrapper = ({ children }: Children): JSX.Element => {
	return <span css={sidebarHeaderWrapperStyles}>{children}</span>;
};
