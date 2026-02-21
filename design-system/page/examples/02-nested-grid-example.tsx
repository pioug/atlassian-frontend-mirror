import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import Link from '@atlaskit/link';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import { Dummy, DummyNested } from './common/dummy';

const NestedGridExample = (): React.JSX.Element => (
	<Page testId="page">
		<Banner appearance="warning" icon={<WarningIcon spacing="spacious" label="Warning" />}>
			We are planning on deprecating Page component. We recommend using the Page layout component
			instead.
			<Link target="_blank" href="https://atlassian.design/components/page-layout">
				{' '}
				View page layout documentation
			</Link>
		</Banner>
		<Grid spacing="cosy" testId="outer-grid">
			<GridColumn medium={12}>
				<h2>Nested Grid</h2>
			</GridColumn>
			<GridColumn medium={8}>
				<Dummy>
					This content sits inside a column of width 8. The text is before the nested grid.
					<Grid testId="inner-grid">
						<GridColumn medium={4}>
							<DummyNested>4 col</DummyNested>
						</GridColumn>
						<GridColumn medium={4}>
							<DummyNested>4 col</DummyNested>
						</GridColumn>
					</Grid>
					This content sits after the nested grid. Notice how the grid pulls itself out into the
					margins of the column its in.
				</Dummy>
			</GridColumn>

			<GridColumn medium={4}>
				<Dummy>4 col</Dummy>
			</GridColumn>
		</Grid>
	</Page>
);
export default NestedGridExample;
