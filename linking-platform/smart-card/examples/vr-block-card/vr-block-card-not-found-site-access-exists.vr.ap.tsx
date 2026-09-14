import React from 'react';

import { NotFoundWithSiteAccessExistsClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardNotFoundSiteAccessExists = (): React.JSX.Element => (
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
