import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Grid, Text } from '@atlaskit/primitives/compiled';

import encodedIcons from '../src/raw-icons';

const styles = cssMap({
	grid: {
		gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
		padding: 'var(--ds-space-400)',
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: 'var(--ds-space-100)',
		padding: 'var(--ds-space-200)',
		borderRadius: 'var(--ds-radius-large)',
		backgroundColor: 'var(--ds-surface)',
		boxShadow: 'var(--ds-shadow-raised)',
	},
});

export default function EncodedIconsExample() {
	return (
		<Grid xcss={styles.grid} gap="space.200">
			{Object.entries(encodedIcons).map(([name, icon]) => (
				<Box key={name} xcss={styles.container}>
					<img src={icon} alt={name} />
					<Text align="center">
						{name
							.replace(/([A-Z])/g, ' $1')
							.trim()
							.split(' ')
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(' ')}
					</Text>
				</Box>
			))}
		</Grid>
	);
}
