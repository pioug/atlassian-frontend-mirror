import React from 'react';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';

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
