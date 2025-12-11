import React from 'react';

import { cssMap } from '@atlaskit/css';
import Image from '@atlaskit/image';
import { rawIcons } from '@atlaskit/logo/raw-icons';
import { Box, Grid, Text } from '@atlaskit/primitives/compiled';

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

export default function EncodedIconsExample(): React.JSX.Element {
	return (
		<Grid xcss={styles.grid} gap="space.200">
			{Object.entries(rawIcons).map(([name, icon]) => (
				<Box key={name} xcss={styles.container}>
					<Image src={icon} alt={name} />
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
