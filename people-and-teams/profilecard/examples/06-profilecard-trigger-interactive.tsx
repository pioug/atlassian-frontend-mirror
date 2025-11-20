import React from 'react';

import ExampleWrapper from './helper/example-wrapper';
import InteractiveTrigger from './helper/interactive-trigger';
import { MainStage } from './helper/main-stage';
import { Section } from './helper/section';
import { getMockProfileClient } from './helper/util';

const mockClient = getMockProfileClient(10, 0);

export default function Example(): React.JSX.Element {
	return (
		<ExampleWrapper>
			<MainStage>
				<Section>
					<h4>Profilecard triggered by hover</h4>
					{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid, @atlaskit/design-system/no-html-anchor */}
					<a href="#">An interactive link to test hover</a>
					<InteractiveTrigger resourceClient={mockClient} />
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}
