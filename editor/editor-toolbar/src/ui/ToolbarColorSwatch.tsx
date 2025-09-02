import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

type ToolbarColorSwatchProps = {
	children?: ReactNode;
	highlightColor?: string;
};

const styles = cssMap({
	colorSwatch: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		width: '20px',
		height: '20px',
		marginLeft: token('space.negative.050'),
		marginRight: token('space.negative.050'),
	},
});

export const ToolbarColorSwatch = ({ children, highlightColor }: ToolbarColorSwatchProps) => {
	return (
		<Box
			xcss={styles.colorSwatch}
			style={{
				backgroundColor: highlightColor,
			}}
		>
			{children}
		</Box>
	);
};
