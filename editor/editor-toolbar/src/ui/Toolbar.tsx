import React, { type ReactNode } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	toolbarBase: {
		backgroundColor: token('elevation.surface'),
		borderRadius: '6px',
		display: 'flex',
		alignItems: 'center',
	},
	toolbar: {
		height: '36px',
		paddingRight: token('space.050'),
		paddingLeft: token('space.050'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	primaryToolbar: {
		backgroundColor: token('elevation.surface'),
		minHeight: '32px',
		paddingTop: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
	},
});

type ToolbarProps = {
	children?: ReactNode;
	label: string;
};

/**
 * A simple component representing a toolbar with box shadows - used to represent a secondary/floating toolbar
 */
export const Toolbar = ({ children, label }: ToolbarProps) => {
	return (
		<Box xcss={cx(styles.toolbarBase, styles.toolbar)} role="toolbar" aria-label={label}>
			{children}
		</Box>
	);
};

/**
 *  A simple component representing a toolbar without box shadows - used to represent a primary toolbar
 */
export const PrimaryToolbar = ({ children, label }: ToolbarProps) => {
	return (
		<Box xcss={cx(styles.toolbarBase, styles.primaryToolbar)} role="toolbar" aria-label={label}>
			{children}
		</Box>
	);
};
