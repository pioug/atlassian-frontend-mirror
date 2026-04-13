/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type DrawerSidebarProps } from '../types';
import { useEnsureIsInsideDrawer } from '../use-ensure-is-inside-drawer';

const styles = cssMap({
	default: {
		alignItems: 'center',
		boxSizing: 'border-box',
		color: token('color.text.subtle'),
		display: 'flex',
		flexShrink: 0,
		flexDirection: 'column',
		height: '100vh',
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.300'),
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
