/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @repo/internal/react/no-clone-element */
import { Children, cloneElement, type ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const containerStyles = css({
	display: 'flex',
	borderBlockEnd: `solid 2px ${token('color.border', '#dfe1e6')}`,
});

export interface HeadersProps {
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
