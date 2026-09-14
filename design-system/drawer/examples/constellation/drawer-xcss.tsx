/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { token } from '@atlaskit/tokens';

import { Lorem } from '../lorem';

const styles = cssMap({
	sidebar: {
		backgroundColor: token('color.background.accent.gray.subtlest'),
	},
	content: {
		marginBlockStart: token('space.0'),
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.300'),
		paddingBlockEnd: token('space.300'),
	},
});

export default function DrawerExample(): JSX.Element {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<React.Fragment>
			<Drawer isOpen={isDrawerOpen} label="Drawer with xcss" onClose={() => setIsDrawerOpen(false)}>
				<DrawerSidebar xcss={styles.sidebar}>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent xcss={styles.content}>
					<Lorem count={10} />
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setIsDrawerOpen(true)}>
				Open drawer
			</Button>
		</React.Fragment>
	);
}
