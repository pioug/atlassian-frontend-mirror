import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
import HeadingItem from '@atlaskit/menu/heading-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';

import MenuGroupContainer from '../common/menu-group-container';

export default (): React.JSX.Element => (
	<MenuGroupContainer>
		<MenuGroup>
			<Section aria-labelledby="actions">
				<HeadingItem id="actions" aria-hidden>
					Actions
				</HeadingItem>
				<ButtonItem>Create article</ButtonItem>
			</Section>
		</MenuGroup>
	</MenuGroupContainer>
);
