import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	section: {
		marginTop: token('space.200', '16px'),
		marginRight: 0,
		marginBottom: token('space.200', '16px'),
		marginLeft: 0,
	},
});

export const Section = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.section}>{children}</Box>;
};
