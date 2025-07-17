import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	container: {
		display: 'flex',
		alignItems: 'center',
	},
});

type ToolbarSectionProps = {
	children?: ReactNode;
};

export const ToolbarSection = ({ children }: ToolbarSectionProps) => {
	return <Box xcss={styles.container}>{children}</Box>;
};
