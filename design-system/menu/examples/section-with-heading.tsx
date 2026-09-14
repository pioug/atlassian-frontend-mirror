import React from 'react';

import ButtonItem from '@atlaskit/menu/button-item';
import HeadingItem from '@atlaskit/menu/heading-item';
import Section from '@atlaskit/menu/section';

export default (): React.JSX.Element => (
	<>
		<Section title="Actions">
			<ButtonItem>Create article</ButtonItem>
		</Section>
		<Section aria-labelledby="actions" hasSeparator>
			<HeadingItem id="actions">Actions</HeadingItem>
			<ButtonItem>Create article</ButtonItem>
		</Section>
	</>
);
