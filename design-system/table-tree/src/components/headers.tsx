/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, cloneElement, type ReactElement } from 'react';

import { css, jsx } from '@compiled/react';
/* eslint-disable @repo/internal/react/no-clone-element */

import { token } from '@atlaskit/tokens';

const containerStyles = css({
	display: 'flex',
	borderBlockEnd: `solid 2px ${token('color.border', '#dfe1e6')}`,
});

interface HeadersProps {
	children: ReactElement | ReactElement[];
}

/**
 * __Headers__
 *
 * Headers component for advanced composition of data, allowing custom data structures.
 *
 * - [Examples](https://atlassian.design/components/table-tree/examples#advanced)
 * - [Code](https://atlassian.design/components/table-tree/code#headers-props)
 */
const Headers = ({ children }: HeadersProps) => (
	// TODO: Determine whether proper `tr` elements can be used instead of
	// roles (DSP-11588)
	<div css={containerStyles} role="row">
		{Children.map(children, (header, index) =>
			cloneElement(header as any, { key: index, columnIndex: index }),
		)}
	</div>
);

export default Headers;
