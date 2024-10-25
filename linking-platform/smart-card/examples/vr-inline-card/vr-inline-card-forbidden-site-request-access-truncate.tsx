import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { ForbiddenWithSiteRequestAccessClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

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
