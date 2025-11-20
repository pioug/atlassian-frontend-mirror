import React from 'react';

import { UnAuthClient } from '@atlaskit/link-test-helpers';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import VRCardView from '../utils/vr-card-view';

const wrapperStyles = xcss({
	width: '200px',
});

export default (): React.JSX.Element => (
	<Box xcss={wrapperStyles}>
		<VRCardView truncateInline appearance="inline" client={new UnAuthClient()} />
	</Box>
);
