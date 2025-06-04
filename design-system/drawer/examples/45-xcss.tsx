/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	sidebar: {
		backgroundColor: token('color.background.accent.blue.bolder'),
	},
	content: {
		marginTop: token('space.0'),
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
});

export default function DrawerExample() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<Box xcss={styles.root}>
			<Drawer
				isOpen={isDrawerOpen}
				label="Drawer with xcss"
				onClose={() => setIsDrawerOpen(false)}
				testId="drawer-default"
			>
				<DrawerSidebar xcss={styles.sidebar}>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent xcss={styles.content}>Drawer content</DrawerContent>
			</Drawer>
			<Button
				id="open-drawer"
				testId="drawer-trigger"
				type="button"
				onClick={() => setIsDrawerOpen(true)}
			>
				Open drawer
			</Button>
		</Box>
	);
}
