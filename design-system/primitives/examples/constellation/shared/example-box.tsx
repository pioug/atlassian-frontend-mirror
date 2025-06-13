/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { BackgroundColor, Box, Space } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	block: {
		display: 'flex',
		borderRadius: '3px',
		minWidth: '2rem',
		minHeight: '2rem',
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.discovery'),
	},
});

const Block = ({
	style = {},
	padding = 'space.200',
	backgroundColor = 'color.background.discovery',
	children,
}: {
	style?: React.CSSProperties;
	padding?: Space;
	backgroundColor?: BackgroundColor;
	children?: ReactNode;
}) => (
	<Box
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={style}
		xcss={styles.block}
		padding={padding}
		backgroundColor={backgroundColor}
	>
		{children}
	</Box>
);

export default Block;
