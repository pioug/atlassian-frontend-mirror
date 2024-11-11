/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Grid, { GridItem } from '@atlaskit/grid';

export default () => (
	<Grid testId="grid">
		<GridItem>visible</GridItem>
		<GridItem span="none">hidden: all breakpoints</GridItem>
		<GridItem span={{ md: 'none' }}>hidden: md and up</GridItem>
		<GridItem>visible</GridItem>
	</Grid>
);
