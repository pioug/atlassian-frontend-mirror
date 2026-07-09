import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
import HeadingItem from '@atlaskit/menu/heading-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';

import MenuGroupContainer from '../common/menu-group-container';

export default (): React.JSX.Element => (
	<MenuGroupContainer>
		<MenuGroup>
			<Section title="Actions">
				<ButtonItem>Create article</ButtonItem>
			</Section>
			<Section aria-labelledby="settings" hasSeparator>
				<HeadingItem id="settings">Settings</HeadingItem>
				<ButtonItem>Manage account</ButtonItem>
			</Section>
		</MenuGroup>
	</MenuGroupContainer>
);
