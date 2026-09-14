import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import type { DrawerWidth } from '@atlaskit/drawer/types';

const widths: DrawerWidth[] = ['narrow', 'medium', 'wide', 'extended', 'full'];

const DrawerWidths = (): React.JSX.Element => {
	const [open, setOpen] = useState<boolean>(false);
	const [drawerWidth, setDrawerWidth] = useState<DrawerWidth>('wide');

	return (
		<>
			<Drawer
				testId="drawer"
				width={drawerWidth}
				onClose={() => setOpen(false)}
				isOpen={open}
				label={`Drawer ${drawerWidth}`}
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					{widths.map((width) => (
						<p>
							<Button isSelected={width === drawerWidth} onClick={() => setDrawerWidth(width)}>
								{width.charAt(0).toUpperCase()}
								{width.substring(1).toLowerCase()}
							</Button>
						</p>
					))}
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				See drawer widths
			</Button>
		</>
	);
};

export default DrawerWidths;
