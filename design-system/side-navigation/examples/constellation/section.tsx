import React from 'react';

import { ButtonItem, HeadingItem, Section } from '@atlaskit/side-navigation';

const SectionExample = () => {
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
