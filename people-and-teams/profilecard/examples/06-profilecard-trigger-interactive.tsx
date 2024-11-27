import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import ExampleWrapper from './helper/example-wrapper';
import InteractiveTrigger from './helper/interactive-trigger';
import { getMockProfileClient } from './helper/util';

const mockClient = getMockProfileClient(10, 0);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Section = styled.div({
	margin: `${token('space.200', '16px')} 0`,
	height: '640px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h4: {
		margin: `${token('space.100', '8px')} 0`,
	},
});

export default function Example() {
	return (
		<ExampleWrapper>
			<MainStage>
				<Section>
					<h4>Profilecard triggered by hover</h4>
					{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
					<a href="#">An interactive link to test hover</a>
					<InteractiveTrigger resourceClient={mockClient} />
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}
