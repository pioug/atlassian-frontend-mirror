import React from 'react';

import { ResolvedClient, ResolvedClientProfileUrl } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const VREmbedProfileObject = () => (
	<VRCardView
		appearance="embed"
		frameStyle="show"
		showHoverPreview={true}
		url={ResolvedClientProfileUrl}
		client={new ResolvedClient()}
	/>
);
