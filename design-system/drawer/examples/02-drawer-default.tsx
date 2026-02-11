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
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

export default function DrawerExample(): JSX.Element {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<Box xcss={styles.root}>
			<Drawer
				isOpen={isDrawerOpen}
				label="Basic drawer"
				onClose={() => setIsDrawerOpen(false)}
				testId="drawer-default"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>Drawer content</DrawerContent>
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
