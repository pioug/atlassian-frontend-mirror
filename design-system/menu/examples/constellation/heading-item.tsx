import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';

import MenuGroupContainer from '../common/menu-group-container';

export default (): React.JSX.Element => (
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
