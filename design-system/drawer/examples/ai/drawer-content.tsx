import React, { useId, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Drawer from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import Heading from '@atlaskit/heading/heading';
import { Text } from '@atlaskit/primitives/compiled/text';

export default function Example(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const titleId = useId();

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open drawer</Button>
			<Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} titleId={titleId}>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Heading id={titleId} size="large">
						Content Title
					</Heading>
					<Text>This is the main content area of the drawer.</Text>
					<Heading size="medium">Settings</Heading>
					<Text>Configure your preferences here.</Text>
				</DrawerContent>
			</Drawer>
		</>
	);
}
