import React, { type ComponentProps } from 'react';

import { mocks, ResolvingClient } from '@atlaskit/link-test-helpers';

import CardViewSection from '../card-view/card-view-section';
import VRTestWrapper from '../utils/vr-test-wrapper';

const VRCardView = (props: ComponentProps<typeof CardViewSection>) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<VRTestWrapper>
		<CardViewSection {...props} />
	</VRTestWrapper>
);

export default () => (
	<VRCardView
		appearance="inline"
		client={new ResolvingClient()}
		// ANIP-288: placeholderData is not part of the public API for CardProps YET
		{...{ placeholderData: mocks.simpleProjectPlaceholderData }}
		title="Placeholder data for SSR"
	/>
);
