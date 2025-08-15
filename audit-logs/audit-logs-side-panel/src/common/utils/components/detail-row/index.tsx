/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Grid } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	rowKey: {
		color: token('color.text.subtle', '#44546F'),
	},
	rowValue: {
		color: token('color.text', '#172B4D'),
		overflowWrap: 'anywhere',
	},
	grid: {
		gridTemplateColumns: '125px 1fr',
	},
});
interface DetailRowProps {
	label: string;
	value: ReactNode;
}

export const DetailRow = ({ label, value }: DetailRowProps) => {
	if (value === null || value === undefined || value === '') {
		return null;
	}

	return (
		<Grid xcss={styles.grid} role="row">
			<Box>
				<span css={styles.rowKey}>{label}</span>
			</Box>
			<Box>
				<span css={styles.rowValue}>{value}</span>
			</Box>
		</Grid>
	);
};
