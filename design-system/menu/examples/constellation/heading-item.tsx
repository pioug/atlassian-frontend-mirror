import React from 'react';

import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';

import MenuGroupContainer from '../common/menu-group-container';

export default () => (
	<MenuGroupContainer>
		<MenuGroup>
			<Section title="Actions">
				<ButtonItem>Create article</ButtonItem>
			</Section>
			<Section>
				<ButtonItem>Create article</ButtonItem>
			</Section>
		</MenuGroup>
	</MenuGroupContainer>
);
