/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */

import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	sidebar: {
		backgroundColor: token('color.background.accent.gray.subtlest'),
	},
	content: {
		marginTop: token('space.0'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
		paddingTop: token('space.300'),
		paddingBottom: token('space.300'),
	},
});

export default function DrawerExample(): JSX.Element {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<>
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
		</>
	);
}
