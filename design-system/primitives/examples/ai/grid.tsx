import * as React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';

const styles = cssMap({
	grid: {
		gridTemplateColumns: '1fr 1fr',
	},
});

export default function GridExample(): React.JSX.Element {
	return (
		<Grid gap="space.200" xcss={styles.grid}>
			<Box backgroundColor="color.background.accent.blue.subtle" padding="space.200">
				Grid item 1
			</Box>
			<Box backgroundColor="color.background.accent.green.subtle" padding="space.200">
				Grid item 2
			</Box>
		</Grid>
	);
}
