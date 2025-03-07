import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import { ResolvedClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

const styles = cssMap({
	container: {
		width: '100px',
	},
});

export default () => (
	<Box xcss={styles.container}>
		<VRCardView appearance="embed" client={new ResolvedClient()} frameStyle="show" />
	</Box>
);
