import React from 'react';

import Banner from '@atlaskit/banner';
import { Code } from '@atlaskit/code';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Link from '@atlaskit/link';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import { Dummy, DummyNested } from './common/dummy';
import VerticalSpace from './common/vertical-space';

const BasicExample = (): React.JSX.Element => {
	return (
		<Page>
			<Banner appearance="warning" icon={<WarningIcon label="Warning" secondaryColor="inherit" />}>
				We are planning on deprecating Page component. We recommend using the Page layout component
				instead.
				<Link target="_blank" href="https://atlassian.design/components/page-layout">
					{' '}
					View page layout documentation
				</Link>
			</Banner>
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
