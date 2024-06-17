import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import ExampleWrapper from './helper/example-wrapper';
import ProfilecardInteractive from './helper/profile-interactive';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Section = styled.div({
	margin: `${token('space.200', '16px')} 0`,
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
					<h4>Interactive Profilecard</h4>
					<ProfilecardInteractive />
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}
