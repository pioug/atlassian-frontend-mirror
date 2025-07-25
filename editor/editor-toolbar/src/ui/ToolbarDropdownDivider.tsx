import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	divider: {
		borderBottomColor: token('color.border'),
		borderBottomStyle: 'solid',
		borderBottomWidth: token('border.width'),
	},
});

export const ToolbarDropdownDivider = () => {
	return <Box xcss={styles.divider} />;
};
