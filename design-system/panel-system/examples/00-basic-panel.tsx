import React from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
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
import { Text } from '@atlaskit/primitives/compiled';

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
				<Checkbox label="Create another" isChecked={false} onChange={() => {}} />
				<Button appearance="primary" onClick={() => {}}>
					Create
				</Button>
			</PanelFooter>
		</PanelContainer>
	);
}
