import React from 'react';

import { ResolvedClient, ResolvedClientProfileUrl } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export const VRInlineProfileCard = () => (
	<VRCardView
		showHoverPreview={true}
		appearance="inline"
		url={ResolvedClientProfileUrl}
		client={new ResolvedClient()}
	/>
);
