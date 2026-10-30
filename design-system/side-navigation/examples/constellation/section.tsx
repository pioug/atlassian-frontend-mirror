import React from 'react';

import { ButtonItem } from '@atlaskit/side-navigation/button-item';
import { HeadingItem } from '@atlaskit/side-navigation/heading-item';
import { Section } from '@atlaskit/side-navigation/section';

const SectionExample = (): React.JSX.Element => {
	return (
		<div>
			<Section title="Planning">
				<ButtonItem>Kanban board</ButtonItem>
			</Section>
			<Section aria-labelledby="actions" hasSeparator>
				<HeadingItem id="actions">Actions</HeadingItem>
				<ButtonItem>Create work item</ButtonItem>
			</Section>
		</div>
	);
};

export default SectionExample;
