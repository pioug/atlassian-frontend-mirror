import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Grid } from '@atlaskit/primitives/grid';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss';

const customBorderStyles = xcss({
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderWidth: 'border.width.selected',
	borderRadius: 'radius.small',
});
const gridAreaStyles = {
	navigation: xcss({ gridArea: 'navigation' }),
	sidenav: xcss({ gridArea: 'sidenav' }),
	content: xcss({ gridArea: 'content' }),
	footer: xcss({ gridArea: 'footer' }),
};
type GridArea = keyof typeof gridAreaStyles;

const Block = ({ gridArea }: { gridArea?: GridArea }) => (
	<Box
		xcss={[customBorderStyles, gridArea && gridAreaStyles[gridArea]]}
		backgroundColor="color.background.neutral"
		padding="space.600"
	/>
);

export default function Basic(): React.JSX.Element {
	return (
		<Grid gap="space.200" alignItems="center">
			<Grid
				testId="grid-basic"
				rowGap="space.200"
				columnGap="space.400"
				templateColumns="1fr 100px 1fr"
			>
				<Block />
				<Block />
				<Block />
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid
				testId="grid-basic"
				rowGap="space.200"
				columnGap="space.400"
				templateRows="200px 100px 200px"
			>
				<Block />
				<Block />
				<Block />
			</Grid>
			<Grid
				testId="grid-basic"
				gap="space.200"
				templateAreas={['navigation navigation', 'sidenav content', 'footer footer']}
			>
				<Block gridArea="navigation" />
				<Block gridArea="sidenav" />
				<Block gridArea="content" />
				<Block gridArea="footer" />
			</Grid>
		</Grid>
	);
}
