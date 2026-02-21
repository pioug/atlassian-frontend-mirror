/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useEnsureIsInsideDrawer } from '../context';
import { type DrawerSidebarProps } from '../types';

const styles = cssMap({
	default: {
		alignItems: 'center',
		boxSizing: 'border-box',
		color: token('color.text.subtle'),
		display: 'flex',
		flexShrink: 0,
		flexDirection: 'column',
		height: '100vh',
		paddingBottom: token('space.200'),
		paddingTop: token('space.300'),
		width: token('space.800'),
	},
});

/**
 * __Drawer sidebar__
 *
 * The sidebar of the drawer panel.
 */
export const DrawerSidebar: ({ children, xcss }: DrawerSidebarProps) => JSX.Element = ({
	children,
	xcss,
}: DrawerSidebarProps) => {
	useEnsureIsInsideDrawer();

	return (
		<div css={styles.default} className={xcss} data-testid="drawer-sidebar">
			{children}
		</div>
	);
};
