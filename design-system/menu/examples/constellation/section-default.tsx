import React from 'react';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '../../src';
import MenuGroupContainer from '../common/menu-group-container';

export default () => (
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
