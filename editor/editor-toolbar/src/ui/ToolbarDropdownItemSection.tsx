import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	container: {
		display: 'flex',
		flexDirection: 'column',
	},
});

type ToolbarDropdownItemSectionProps = {
	children?: ReactNode;
};

export const ToolbarDropdownItemSection = ({ children }: ToolbarDropdownItemSectionProps) => {
	return <Box xcss={styles.container}>{children}</Box>;
};
