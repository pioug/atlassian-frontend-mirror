import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';

import { Lorem } from '../lorem';

const DrawerDefaultExample = (): React.JSX.Element => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<Drawer label="Default drawer" onClose={() => setOpen(false)} isOpen={open}>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Lorem count={10} />
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setOpen(true)}>
				Open drawer
			</Button>
		</>
	);
};

export default DrawerDefaultExample;
