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
		gap: token('space.050'),
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
	},
});

type ToolbarProps = {
	children?: ReactNode;
	/**
	 * aria-label for the toolbar (No localisation needed as it won't be read by screen readers).
	 *
	 * use case: query select the toolbar to position floating toolbar
	 */
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
