import React from 'react';

import Page, { Grid, GridColumn } from '@atlaskit/page';

import { Dummy } from '../common/dummy';
import VerticalSpace from '../common/vertical-space';

const columns = 6;
const GridFluidLayoutExample = () => {
	return (
		<Page>
			<Grid layout="fluid" spacing="comfortable" columns={columns}>
				<GridColumn medium={columns}>
					<h3>Comfortable spacing</h3>
				</GridColumn>
				<GridColumn medium={3}>
					<Dummy hasMargin>3 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy hasMargin>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={1}>
					<Dummy hasMargin>1 col</Dummy>
				</GridColumn>
				<GridColumn>
					<Dummy hasMargin>Unspecified</Dummy>
				</GridColumn>
			</Grid>

			<VerticalSpace />

			<Grid layout="fluid" spacing="cosy" columns={columns}>
				<GridColumn medium={columns}>
					<h3>Cosy spacing (default)</h3>
				</GridColumn>
				<GridColumn medium={3}>
					<Dummy hasMargin>3 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy hasMargin>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={1}>
					<Dummy hasMargin>1 col</Dummy>
				</GridColumn>
				<GridColumn>
					<Dummy hasMargin>Unspecified</Dummy>
				</GridColumn>
			</Grid>

			<VerticalSpace />

			<Grid layout="fluid" spacing="compact" columns={columns}>
				<GridColumn medium={columns}>
					<h3>Compact spacing</h3>
				</GridColumn>
				<GridColumn medium={3}>
					<Dummy hasMargin>3 col</Dummy>
				</GridColumn>
				<GridColumn medium={2}>
					<Dummy hasMargin>2 col</Dummy>
				</GridColumn>
				<GridColumn medium={1}>
					<Dummy hasMargin>1 col</Dummy>
				</GridColumn>
				<GridColumn>
					<Dummy hasMargin>Unspecified</Dummy>
				</GridColumn>
			</Grid>
		</Page>
	);
};
export default GridFluidLayoutExample;
