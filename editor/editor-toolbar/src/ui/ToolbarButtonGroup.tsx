import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	container: {
		display: 'flex',
	},
});

type ToolbarButtonGroupProps = {
	children?: ReactNode;
};

export const ToolbarButtonGroup = ({ children }: ToolbarButtonGroupProps) => {
	return <Box xcss={styles.container}>{children}</Box>;
};
