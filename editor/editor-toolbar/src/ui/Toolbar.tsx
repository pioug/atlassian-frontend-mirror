import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	toolbar: {
		backgroundColor: token('elevation.surface'),
		paddingRight: token('space.050'),
		paddingLeft: token('space.050'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: '6px',
		height: '36px',
		width: 'min-content',
		display: 'flex',
		alignItems: 'center',
	},
});

type ToolbarProps = {
	children?: ReactNode;
	label: string;
};

export const Toolbar = ({ children, label }: ToolbarProps) => {
	return (
		<Box xcss={styles.toolbar} role="toolbar" aria-label={label}>
			{children}
		</Box>
	);
};
