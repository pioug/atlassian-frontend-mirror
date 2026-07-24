/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { UnauthorizedSVG } from '../unauthorized-svg';

const styles = cssMap({
	container: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: token('space.300'),
		paddingBottom: token('space.300'),
	},
});

const NoAuthAvailableImage = (): React.JSX.Element => (
	<Box xcss={styles.container}>
		<UnauthorizedSVG />
	</Box>
);

export default NoAuthAvailableImage;
