import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
import LinkItem from '@atlaskit/menu/link-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';

const Examples = (): React.JSX.Element => (
	<>
		<MenuGroup spacing="cozy">
			<Section title="Navigation">
				<LinkItem href="/dashboard">Dashboard</LinkItem>
				<LinkItem href="/projects">Projects</LinkItem>
				<LinkItem href="/settings">Settings</LinkItem>
			</Section>
		</MenuGroup>
		<MenuGroup spacing="compact">
			<Section title="Actions">
				<ButtonItem>Create New</ButtonItem>
				<ButtonItem>Import</ButtonItem>
				<ButtonItem>Export</ButtonItem>
			</Section>
			<Section title="Help">
				<LinkItem href="/docs">Documentation</LinkItem>
				<LinkItem href="/support">Support</LinkItem>
			</Section>
		</MenuGroup>
	</>
);
export default Examples;
