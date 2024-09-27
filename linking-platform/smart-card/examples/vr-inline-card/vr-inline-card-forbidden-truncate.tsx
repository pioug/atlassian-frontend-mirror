import React from 'react';

import { ForbiddenClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';
import { Box, xcss } from '@atlaskit/primitives';

const wrapperStyles = xcss({
	width: '200px',
});
export default () => (
	<Box xcss={wrapperStyles}>
		<VRCardView appearance="inline" truncateInline client={new ForbiddenClient()} />
	</Box>
);
