/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type SyntheticEvent, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Drawer, { DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		paddingTop: token('space.200', '16px'),
		paddingRight: token('space.200', '16px'),
		paddingBottom: token('space.200', '16px'),
		paddingLeft: token('space.200', '16px'),
	},
});

export default () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const returnFocusRef = useRef<HTMLButtonElement>(null);

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const onClose = (...args: [SyntheticEvent<HTMLElement>, any]) => {
		console.log('onClose', args);
		setIsDrawerOpen(false);
	};

	const onCloseComplete = (args: any) => console.log('onCloseComplete', args);

	const onOpenComplete = (args: any) => console.log('onOpenComplete', args);

	return (
		<Box xcss={containerStyles.root}>
			<Drawer
				onClose={onClose}
				onCloseComplete={onCloseComplete}
				onOpenComplete={onOpenComplete}
				isOpen={isDrawerOpen}
				width="wide"
				label="Basic drawer"
				shouldReturnFocus={returnFocusRef}
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<code>Content</code>
				</DrawerContent>
			</Drawer>
			<Inline space="space.200">
				<Button appearance="primary" id="open-drawer" type="button" onClick={openDrawer}>
					Open drawer
				</Button>
				<Button appearance="primary" type="button" ref={returnFocusRef}>
					Focused on drawer close
				</Button>
			</Inline>
		</Box>
	);
};
