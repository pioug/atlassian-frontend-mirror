import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';

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
