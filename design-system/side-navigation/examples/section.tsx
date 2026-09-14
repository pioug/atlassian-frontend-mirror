import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { NavigationContent } from '@atlaskit/side-navigation/navigation-content';
import { Section } from '@atlaskit/side-navigation/section';

const Example = (): React.JSX.Element => (
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
