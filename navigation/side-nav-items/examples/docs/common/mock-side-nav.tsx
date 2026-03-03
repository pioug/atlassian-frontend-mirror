/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const mockSideNavStyles = cssMap({
	root: {
		width: '300px',
		backgroundColor: token('elevation.surface'),
		borderColor: token('color.border'),
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
	},
});

export function MockSideNav({ children }: { children: React.ReactNode }) {
	return <div css={mockSideNavStyles.root}>{children}</div>;
}
