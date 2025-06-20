/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

// Project tiles have a 20x20 size
const styles = cssMap({
	root: {
		width: '20px',
		height: '20px',
		borderRadius: token('border.radius'),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: token('color.text.inverse'),
	},
});

export function ProjectTile({
	backgroundColor,
	children,
}: {
	backgroundColor: string;
	children: ReactNode;
}) {
	return (
		<div css={styles.root} style={{ backgroundColor }} role="presentation">
			{children}
		</div>
	);
}
