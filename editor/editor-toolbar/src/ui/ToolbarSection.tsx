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
	testId?: string;
};

export const ToolbarSection = ({ children, testId }: ToolbarSectionProps) => {
	return (
		<Box xcss={styles.container} testId={testId}>
			{children}
		</Box>
	);
};
