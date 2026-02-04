import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Grid } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	grid: {
		gridTemplateColumns: '1fr 1fr',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map
const _default_1: React.JSX.Element[] = [
    <Grid gap="space.200" xcss={styles.grid}>
        <Box backgroundColor="color.background.accent.blue.subtle" padding="space.200">
            Grid item 1
        </Box>
        <Box backgroundColor="color.background.accent.green.subtle" padding="space.200">
            Grid item 2
        </Box>
    </Grid>,
];
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map
export default _default_1;
