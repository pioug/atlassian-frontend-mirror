/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customBorder: {
		borderColor: token('color.border'),
		borderStyle: 'dashed',
		borderWidth: token('border.width.selected'),
		borderRadius: token('radius.small'),
	},
	columns: {
		gridTemplateColumns: '1fr 100px 1fr',
	},
	rows: {
		gridTemplateRows: '200px 100px 200px',
	},
	areas: {
		gridTemplateAreas: `
			"navigation navigation"
			"sidenav content"
			"footer footer"
		`,
	},
	navigation: { gridArea: 'navigation' },
	sidenav: { gridArea: 'sidenav' },
	content: { gridArea: 'content' },
	footer: { gridArea: 'footer' },
});
type GridArea = 'navigation' | 'sidenav' | 'content' | 'footer';

const Block = ({ gridArea }: { gridArea?: GridArea }) => (
	<Box
		xcss={cx(styles.customBorder, gridArea && styles[gridArea])}
		backgroundColor="color.background.neutral"
		padding="space.600"
	/>
);

export default function Basic(): JSX.Element {
	return (
		<Grid gap="space.200" alignItems="center">
			<Grid testId="grid-basic" rowGap="space.200" columnGap="space.400" xcss={styles.columns}>
				<Block />
				<Block />
				<Block />
				<Block />
				<Block />
				<Block />
			</Grid>

			<Grid testId="grid-basic" rowGap="space.200" columnGap="space.400" xcss={styles.rows}>
				<Block />
				<Block />
				<Block />
			</Grid>

			<Grid testId="grid-basic" gap="space.200" xcss={styles.areas}>
				<Block gridArea="navigation" />
				<Block gridArea="sidenav" />
				<Block gridArea="content" />
				<Block gridArea="footer" />
			</Grid>
		</Grid>
	);
}
