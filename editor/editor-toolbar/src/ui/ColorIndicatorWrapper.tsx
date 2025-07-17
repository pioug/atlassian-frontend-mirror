import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

type ColorIndicatorWrapperProps = {
	children?: ReactNode;
	color?: string;
};

const styles = cssMap({
	indicator: {
		height: '16px',
		borderBottomColor: token('color.border.bold'),
		borderBottomStyle: 'solid',
		borderBottomWidth: token('border.width.indicator'),
	},
});

export const ColorIndicatorWrapper = ({ color, children }: ColorIndicatorWrapperProps) => (
	<Box xcss={styles.indicator} style={{ borderBottomColor: color }} as="span">
		{children}
	</Box>
);
