/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { css, jsx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Drawer, { DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const DrawersExample = () => {
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
