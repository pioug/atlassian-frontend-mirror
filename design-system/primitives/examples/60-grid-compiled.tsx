/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, type BoxProps, Grid } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customBorder: {
		borderColor: token('color.border'),
		borderStyle: 'dashed',
		borderWidth: token('border.width.outline'),
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
});

// NOTE: We just cheat with `style`, do not copy this pattern into your code…
const Block = ({ style }: { style?: BoxProps<'div'>['style'] }) => (
	<Box
		xcss={styles.customBorder}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={style}
		backgroundColor="color.background.neutral"
		padding="space.600"
	/>
);

export default function Basic() {
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
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'navigation' }} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'sidenav' }} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'content' }} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Block style={{ gridArea: 'footer' }} />
			</Grid>
		</Grid>
	);
}
