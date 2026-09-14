/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type SyntheticEvent, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const _default: () => JSX.Element = () => {
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
export default _default;
