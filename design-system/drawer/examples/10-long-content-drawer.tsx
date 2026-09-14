/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { token } from '@atlaskit/tokens';

import { Lorem } from './lorem';

const containerStyles = css({
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const DrawersExample: () => JSX.Element = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const openDrawer = () => setIsDrawerOpen(true);
	const closeDrawer = () => setIsDrawerOpen(false);
	return (
		<div css={containerStyles}>
			<Drawer onClose={closeDrawer} isOpen={isDrawerOpen} width="wide" titleId="drawerTitle">
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent scrollContentLabel="Long Content">
					<h2 id="drawerTitle">Long content drawer</h2>
					<Lorem count={100} />
				</DrawerContent>
			</Drawer>
			<Button type="button" onClick={openDrawer}>
				Open drawer
			</Button>
		</div>
	);
};

export default DrawersExample;
