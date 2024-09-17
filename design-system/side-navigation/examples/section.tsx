import React from 'react';

import { ButtonItem, NavigationContent, Section } from '../src';

const Example = () => (
	<NavigationContent testId="navigation-content-for-sections">
		<Section title="Primary actions">
			<ButtonItem>Create issue</ButtonItem>
		</Section>
		<Section title="Secondary actions" hasSeparator>
			<ButtonItem>Create issue</ButtonItem>
		</Section>
		<Section title="More Actions">
			<ButtonItem>Create issue</ButtonItem>
		</Section>
	</NavigationContent>
);

export default Example;
