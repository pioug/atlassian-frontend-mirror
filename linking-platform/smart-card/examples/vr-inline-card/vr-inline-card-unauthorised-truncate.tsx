import React from 'react';

import { UnAuthClient } from '@atlaskit/link-test-helpers';
import { Box, xcss } from '@atlaskit/primitives';

import VRCardView from '../utils/vr-card-view';

const wrapperStyles = xcss({
	width: '200px',
});

export default () => (
	<Box xcss={wrapperStyles}>
		<VRCardView truncateInline appearance="inline" client={new UnAuthClient()} />
	</Box>
);
