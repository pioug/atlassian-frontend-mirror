import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Drawer, DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer/compiled';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';

export default () => {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div>
			<Drawer
				onClose={() => setIsOpen(false)}
				testId="menu"
				isOpen={isOpen}
				label="Navigation menu"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<MenuGroup>
						<Section title="Starred">
							<ButtonItem description="Next-gen software project">Navigation System</ButtonItem>
							<ButtonItem description="Next-gen service desk">Analytics Platform</ButtonItem>
						</Section>
						<Section title="Recent">
							<ButtonItem description="Next-gen software project">Fabric Editor</ButtonItem>
							<ButtonItem description="Classic business project">Content Services</ButtonItem>
							<ButtonItem description="Next-gen software project">Trinity Mobile</ButtonItem>
							<ButtonItem description="Classic service desk">Customer Feedback</ButtonItem>
							<ButtonItem description="Classic software project">Design System</ButtonItem>
						</Section>
						<Section hasSeparator>
							<ButtonItem>View all projects</ButtonItem>
							<ButtonItem>Create project</ButtonItem>
						</Section>
					</MenuGroup>
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setIsOpen(true)}>
				Open drawer
			</Button>
		</div>
	);
};
