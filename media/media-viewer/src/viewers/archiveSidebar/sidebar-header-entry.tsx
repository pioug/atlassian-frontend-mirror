/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx, css } from '@compiled/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { token } from '@atlaskit/tokens';

import type { Children } from './styleWrappers';

const sidebarHeaderEntryStyles = css({
	flex: '1 1 auto',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1.14286,
	color: token('color.text'),
});

export const SidebarHeaderEntry = ({ children }: Children): JSX.Element => {
	return <div css={sidebarHeaderEntryStyles}>{children}</div>;
};
