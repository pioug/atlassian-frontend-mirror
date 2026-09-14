import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
import HeadingItem from '@atlaskit/menu/heading-item';
import MenuGroup from '@atlaskit/menu/menu-group';
import Section from '@atlaskit/menu/section';

import MenuGroupContainer from '../common/menu-group-container';

export default (): React.JSX.Element => (
	<MenuGroupContainer>
		<MenuGroup maxHeight={300}>
			<Section title="Articles" isScrollable>
				<ButtonItem>Get started</ButtonItem>
				<ButtonItem>Set up your environment</ButtonItem>
				<ButtonItem>Composing code</ButtonItem>
				<ButtonItem>Design tokens</ButtonItem>
				<ButtonItem>Components</ButtonItem>
				<ButtonItem>Patterns</ButtonItem>
				<ButtonItem>Foundations</ButtonItem>
				<ButtonItem>Accessibility</ButtonItem>
				<ButtonItem>Primitives</ButtonItem>
				<ButtonItem>What's new</ButtonItem>
				<ButtonItem>Contribution</ButtonItem>
				<ButtonItem>Contact us</ButtonItem>
			</Section>
			<Section aria-labelledby="actions" hasSeparator>
				<HeadingItem id="actions">Actions</HeadingItem>
				<ButtonItem>Create article</ButtonItem>
			</Section>
		</MenuGroup>
	</MenuGroupContainer>
);
