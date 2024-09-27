import React from 'react';

import VRCardView from '../utils/vr-card-view';
import { ForbiddenWithSiteRequestAccessClient } from '../utils/custom-client';
import { Box, xcss } from '@atlaskit/primitives';

const wrapperStyles = xcss({
	width: '200px',
});

export default () => (
	<Box xcss={wrapperStyles}>
		<VRCardView
			appearance="inline"
			truncateInline
			client={new ForbiddenWithSiteRequestAccessClient()}
		/>
	</Box>
);
