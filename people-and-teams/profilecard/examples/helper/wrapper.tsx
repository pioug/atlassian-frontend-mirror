import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export const CardWrapper = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.cardWrapper}>{children}</Box>;
};

const styles = cssMap({
	cardWrapper: {
		display: 'inline-block',
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});
