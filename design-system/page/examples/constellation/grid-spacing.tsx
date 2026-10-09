import React from 'react';

import Grid from '@atlaskit/page/grid';
import { GridColumn } from '@atlaskit/page/grid-column';
import Page from '@atlaskit/page/page';

import { Dummy } from '../common/dummy';
import VerticalSpace from '../common/vertical-space';

const GridSpacingExample = (): React.JSX.Element => {
	return (
		<Page>
			<Grid>
				<GridColumn medium={12}>
					<h2>Cosy spacing (default)</h2>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
			</Grid>

			<VerticalSpace />

			<Grid spacing="compact">
				<GridColumn medium={12}>
					<h2>Compact spacing</h2>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
			</Grid>

			<VerticalSpace />

			<Grid spacing="comfortable">
				<GridColumn medium={12}>
					<h2>Comfortable spacing</h2>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy>2 col</Dummy>
				</GridColumn>
			</Grid>
		</Page>
	);
};
export default GridSpacingExample;
