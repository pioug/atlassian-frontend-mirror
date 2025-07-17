import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	divider: {
		height: '16px',
		borderLeftColor: token('color.border'),
		borderLeftStyle: 'solid',
		borderLeftWidth: token('border.width'),
		marginLeft: token('space.050'),
		marginRight: token('space.050'),
	},
});

export const ToolbarDivider = () => {
	return <Box xcss={styles.divider} />;
};
