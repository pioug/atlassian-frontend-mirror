import React from 'react';

import { NotFoundWithSiteAccessExistsClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export const BlockCardNotFoundSiteAccessExists = () => (
	<VRCardView
		appearance="block"
		client={new NotFoundWithSiteAccessExistsClient()}
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			width: '760px',
		}}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
