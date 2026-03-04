/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	sidebar: {
		backgroundColor: token('color.background.accent.blue.bolder'),
	},
	content: {
		marginBlockStart: token('space.0'),
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
	},
});

export default function DrawerExample(): JSX.Element {
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
