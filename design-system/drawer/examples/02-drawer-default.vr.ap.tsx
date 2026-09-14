/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
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
