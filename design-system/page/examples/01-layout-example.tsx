import React from 'react';

import Page, { Grid, GridColumn } from '../src';

import { Dummy } from './common/dummy';

const LayoutExample = () => (
	<Page testId="page">
		<Grid>
			<GridColumn medium={12}>
				<h2>Default Layout</h2>
			</GridColumn>
			<GridColumn medium={4}>
				<Dummy>4 col</Dummy>
			</GridColumn>
			<GridColumn medium={4}>
				<Dummy>4 col</Dummy>
			</GridColumn>
			<GridColumn medium={3}>
				<Dummy>3 col</Dummy>
			</GridColumn>
			<GridColumn medium={1}>
				<Dummy>1 col</Dummy>
			</GridColumn>
			<GridColumn>
				<Dummy>Unspecified</Dummy>
			</GridColumn>
		</Grid>
		<Grid layout="fluid">
			<GridColumn medium={12}>
				<h2>Fluid Layout</h2>
			</GridColumn>
			<GridColumn medium={4}>
				<Dummy>4 col</Dummy>
			</GridColumn>
			<GridColumn medium={4}>
				<Dummy>4 col</Dummy>
			</GridColumn>
			<GridColumn medium={3}>
				<Dummy>3 col</Dummy>
			</GridColumn>
			<GridColumn medium={1}>
				<Dummy>1 col</Dummy>
			</GridColumn>
			<GridColumn>
				<Dummy>Unspecified</Dummy>
			</GridColumn>
		</Grid>
	</Page>
);
export default LayoutExample;
