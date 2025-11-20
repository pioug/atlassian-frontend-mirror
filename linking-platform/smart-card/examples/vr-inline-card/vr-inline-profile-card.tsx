import React from 'react';

import { ResolvedClient, ResolvedClientProfileUrl } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const VRInlineProfileCard = (): React.JSX.Element => (
	<VRCardView
		showHoverPreview={true}
		appearance="inline"
		url={ResolvedClientProfileUrl}
		client={new ResolvedClient()}
	/>
);
