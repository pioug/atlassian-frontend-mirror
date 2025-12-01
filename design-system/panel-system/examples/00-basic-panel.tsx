import React from 'react';

import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import {
	PanelActionExpand,
	PanelActionGroup,
	PanelActionMore,
	PanelActionNewTab,
	PanelBody,
	PanelContainer,
	PanelFooter,
	PanelHeader,
	PanelTitle,
} from '@atlaskit/panel-system';
import { Box, Text } from '@atlaskit/primitives/compiled';

export default function BasicPanel(): React.JSX.Element {
	return (
		<PanelContainer testId="basic-panel">
			<PanelHeader>
				<PanelTitle>Basic Panel Example</PanelTitle>
				<PanelActionGroup>
					<PanelActionExpand onClick={() => {}} />
					<PanelActionNewTab href="https://atlassian.design/components" />
					<PanelActionMore onClick={() => {}} />
				</PanelActionGroup>
			</PanelHeader>
			<PanelBody>
				<Text as="p">This is a basic example of the Panel System components.</Text>
				<Text as="p">
					The panel includes a header with title and actions, and a body area for content.
				</Text>
			</PanelBody>
			<PanelFooter>
				<Box />
				<ButtonGroup label="Panel actions">
					<Button appearance="subtle" onClick={() => {}}>
						Cancel
					</Button>
					<Button appearance="default" onClick={() => {}}>
						Save
					</Button>
				</ButtonGroup>
			</PanelFooter>
		</PanelContainer>
	);
}
