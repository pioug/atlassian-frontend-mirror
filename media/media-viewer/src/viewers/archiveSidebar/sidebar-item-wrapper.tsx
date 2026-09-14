/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import type { Children } from './styleWrappers';

const sidebarItemWrapperStyles = css({
	width: '85%',
});

export const SidebarItemWrapper = ({ children }: Children): JSX.Element => {
	return <div css={sidebarItemWrapperStyles}>{children}</div>;
};
