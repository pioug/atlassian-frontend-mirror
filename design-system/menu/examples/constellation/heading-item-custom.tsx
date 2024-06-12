import React from 'react';

import { ButtonItem, HeadingItem, MenuGroup, Section } from '../../src';
import MenuGroupContainer from '../common/menu-group-container';

export default () => (
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
