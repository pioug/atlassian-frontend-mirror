/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';

const mockSideNavStyles = cssMap({
	root: {
		width: '300px',
	},
});

export function MockSideNav({ children }: { children: React.ReactNode }): JSX.Element {
	return <div css={mockSideNavStyles.root}>{children}</div>;
}
