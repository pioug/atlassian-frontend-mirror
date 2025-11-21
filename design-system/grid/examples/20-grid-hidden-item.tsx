import React from 'react';

import Grid, { GridItem } from '@atlaskit/grid';

export default (): React.JSX.Element => (
	<Grid testId="grid">
		<GridItem>visible</GridItem>
		<GridItem span="none">hidden: all breakpoints</GridItem>
		<GridItem span={{ md: 'none' }}>hidden: md and up</GridItem>
		<GridItem>visible</GridItem>
	</Grid>
);
