import React from 'react';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';
import ProfilecardInteractive from './helper/profile-interactive';
import { Section } from './helper/section';

export default function Example(): React.JSX.Element {
	return (
		<ExampleWrapper>
			<MainStage>
				<Section>
					<h4>Interactive Profilecard</h4>
					<ProfilecardInteractive />
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}
