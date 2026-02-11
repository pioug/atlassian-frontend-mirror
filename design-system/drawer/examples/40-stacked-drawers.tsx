/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type SyntheticEvent, useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Drawer, { DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';

const spacingStyles = css({
	padding: '2rem',
});

export default function DrawersExample(): JSX.Element {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isNestedDrawerOpen, setIsNestedDrawerOpen] = useState(false);

	const openDrawer = useCallback(() => {
		setIsDrawerOpen(true);
		setIsNestedDrawerOpen(false);
	}, []);

	const openNestedDrawer = useCallback(() => {
		setIsNestedDrawerOpen(true);
	}, []);

	const onClose = useCallback((...args: [SyntheticEvent, any]) => {
		console.log('onClose', args);
		setIsDrawerOpen(false);
		setIsNestedDrawerOpen(false);
	}, []);

	const onNestedClose = useCallback((...args: [SyntheticEvent, any]) => {
		console.log('onClose Nested', args);
		setIsNestedDrawerOpen(false);
	}, []);

	const onCloseComplete = useCallback((args: any) => console.log('onCloseComplete', args), []);

	const onNestedCloseComplete = useCallback(
		(args: any) => console.log('onNestedCloseComplete', args),
		[],
	);

	return (
		<div css={spacingStyles}>
			<Drawer
				onClose={onClose}
				onCloseComplete={onCloseComplete}
				isOpen={isDrawerOpen}
				width="narrow"
				label="Drawer with nested drawer"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<code>Drawer contents</code>
					<div css={spacingStyles}>
						<Button id="open-drawer" type="button" onClick={openNestedDrawer}>
							Open Nested drawer
						</Button>
					</div>
					<div css={spacingStyles}>
						<Drawer
							onClose={onNestedClose}
							onCloseComplete={onNestedCloseComplete}
							isOpen={isNestedDrawerOpen}
							width="extended"
							label="Nested drawer"
						>
							<DrawerSidebar>
								<DrawerCloseButton />
							</DrawerSidebar>
							<DrawerContent>
								<code>Nested Drawer Content</code>
							</DrawerContent>
						</Drawer>
					</div>
				</DrawerContent>
			</Drawer>
			<Button id="open-drawer" type="button" onClick={openDrawer}>
				Open drawer
			</Button>
		</div>
	);
}
