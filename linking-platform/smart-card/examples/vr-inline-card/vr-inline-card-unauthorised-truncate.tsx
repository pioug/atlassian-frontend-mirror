import React from 'react';

import { UnAuthClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

import { Box, xcss } from '@atlaskit/primitives';

const wrapperStyles = xcss({
	width: '200px',
});

export default () => (
	<Box xcss={wrapperStyles}>
		<VRCardView truncateInline appearance="inline" client={new UnAuthClient()} />
	</Box>
);
