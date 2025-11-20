import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	mainStage: {
		marginTop: token('space.200', '16px'),
		marginRight: token('space.200', '16px'),
		marginBottom: token('space.200', '16px'),
		marginLeft: token('space.200', '16px'),
	},
});

export const MainStage = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
	return <Box xcss={styles.mainStage}>{children}</Box>;
};
