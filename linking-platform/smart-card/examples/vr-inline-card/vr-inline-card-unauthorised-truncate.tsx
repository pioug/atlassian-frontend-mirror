import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { UnAuthClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';


const wrapperStyles = xcss({
	width: '200px',
});

export default () => (
	<Box xcss={wrapperStyles}>
		<VRCardView truncateInline appearance="inline" client={new UnAuthClient()} />
	</Box>
);
