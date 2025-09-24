import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	blankSpace: {
		height: '800px',
	},
});

export const BlankSpace = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.blankSpace}>{children}</Box>;
};
