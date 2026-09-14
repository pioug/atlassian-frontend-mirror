import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
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
