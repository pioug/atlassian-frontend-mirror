import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Drawer, { DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import Heading from '@atlaskit/heading';
import { Text } from '@atlaskit/primitives/compiled';

export default [
	() => {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
				<Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} label="Basic drawer">
					<DrawerSidebar>
						<DrawerCloseButton />
					</DrawerSidebar>
					<DrawerContent>
						<Heading size="large">Drawer Content</Heading>
						<Text>This is the main content area of the drawer.</Text>
					</DrawerContent>
				</Drawer>
			</>
		);
	},
];
