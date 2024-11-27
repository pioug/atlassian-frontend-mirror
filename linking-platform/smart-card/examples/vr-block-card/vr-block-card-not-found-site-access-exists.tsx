import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { NotFoundWithSiteAccessExistsClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

const containerStyles = css({
	width: '760px',
});
export const BlockCardNotFoundSiteAccessExists = () => (
	<VRCardView
		appearance="block"
		client={new NotFoundWithSiteAccessExistsClient()}
		overrideCss={containerStyles}
		url="https://site.atlassian.net/browse/key-1"
	/>
);
