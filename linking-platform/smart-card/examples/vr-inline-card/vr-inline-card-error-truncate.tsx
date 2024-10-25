import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

import { ErroredClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

const wrapperStyles = xcss({
	width: '100px',
});

export default () => (
	<Box xcss={wrapperStyles}>
		<VRCardView appearance="inline" truncateInline client={new ErroredClient()} />
	</Box>
);
