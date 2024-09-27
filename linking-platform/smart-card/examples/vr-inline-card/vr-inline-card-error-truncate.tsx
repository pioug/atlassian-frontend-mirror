import React from 'react';

import { ErroredClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';
import { Box, xcss } from '@atlaskit/primitives';

const wrapperStyles = xcss({
	width: '100px',
});

export default () => (
	<Box xcss={wrapperStyles}>
		<VRCardView appearance="inline" truncateInline client={new ErroredClient()} />
	</Box>
);
