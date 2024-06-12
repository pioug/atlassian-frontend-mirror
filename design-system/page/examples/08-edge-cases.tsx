import React from 'react';

import { Code } from '@atlaskit/code';

import Page, { Grid, GridColumn } from '../src';

import { Dummy, DummyNested } from './common/dummy';
import VerticalSpace from './common/vertical-space';

const BasicExample = () => {
	return (
		<Page>
			<Grid spacing="comfortable" layout="fluid" testId="column-none">
				<Dummy>
					This container is not wrapped in a <Code>GridColumn</Code>.
				</Dummy>
				<Dummy>Neither is this one.</Dummy>
			</Grid>
			<VerticalSpace />
			<Grid spacing="comfortable" layout="fluid" testId="column-mixed">
				<Dummy>
					This container is not wrapped in a <Code>GridColumn</Code>.
				</Dummy>
				<GridColumn>
					<Dummy>But this one is.</Dummy>
				</GridColumn>
			</Grid>
			<VerticalSpace />
			<Grid spacing="comfortable" layout="fluid" testId="column-nested">
				<Dummy>
					This container is not wrapped in a <Code>GridColumn</Code>.
					<GridColumn medium={12}>
						<DummyNested>This column is nested inside.</DummyNested>
					</GridColumn>
				</Dummy>
			</Grid>
		</Page>
	);
};

export default BasicExample;
