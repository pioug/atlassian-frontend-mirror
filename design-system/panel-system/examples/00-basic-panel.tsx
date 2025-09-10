import React from 'react';

import {
	PanelActionExpand,
	PanelActionGroup,
	PanelActionMore,
	PanelActionNewTab,
	PanelBody,
	PanelContainer,
	PanelHeader,
	PanelTitle,
} from '@atlaskit/panel-system';
import { Text } from '@atlaskit/primitives/compiled';

export default function BasicPanel() {
	const handleExpand = () => {
		console.log('Panel expanded to full screen');
	};

	const handleMoreActions = () => {
		console.log('More actions clicked');
	};

	return (
		<PanelContainer testId="basic-panel">
			<PanelHeader>
				<PanelTitle>Basic Panel Example</PanelTitle>
				<PanelActionGroup>
					<PanelActionExpand onClick={handleExpand} />
					<PanelActionNewTab href="https://atlassian.design/components" />
					<PanelActionMore onClick={handleMoreActions} />
				</PanelActionGroup>
			</PanelHeader>
			<PanelBody>
				<Text as="p">This is a basic example of the Panel System components.</Text>
				<Text as="p">
					The panel includes a header with title and actions, and a body area for content.
				</Text>
			</PanelBody>
		</PanelContainer>
	);
}
