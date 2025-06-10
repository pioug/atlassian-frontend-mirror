import React from 'react';

import { ButtonItem, NavigationContent, Section } from '@atlaskit/side-navigation';

const Example = () => (
	<NavigationContent testId="navigation-content-for-sections">
		<Section title="Primary actions">
			<ButtonItem>Create work item</ButtonItem>
		</Section>
		<Section title="Secondary actions" hasSeparator>
			<ButtonItem>Create work item</ButtonItem>
		</Section>
		<Section title="More Actions">
			<ButtonItem>Create work item</ButtonItem>
		</Section>
	</NavigationContent>
);

export default Example;
