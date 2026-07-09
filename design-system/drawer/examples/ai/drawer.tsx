import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Drawer from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import Heading from '@atlaskit/heading/heading';
import { Text } from '@atlaskit/primitives/compiled/text';

const examples: (() => React.JSX.Element)[] = [
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

export default examples;
