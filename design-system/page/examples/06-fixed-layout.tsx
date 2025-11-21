import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Link from '@atlaskit/link';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import { Dummy } from './common/dummy';
import VerticalSpace from './common/vertical-space';

const columns = 6;
const FixedLayoutExample = (): React.JSX.Element => (
	<Page testId="page">
		<Banner appearance="warning" icon={<WarningIcon label="Warning" secondaryColor="inherit" />}>
			We are planning on deprecating Page component. We recommend using the Page layout component
			instead.
			<Link target="_blank" href="https://atlassian.design/components/page-layout">
				{' '}
				View page layout documentation
			</Link>
		</Banner>
		<Grid spacing="comfortable" columns={columns}>
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

		<Grid spacing="cosy" columns={columns}>
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

		<Grid spacing="compact" columns={columns}>
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
export default FixedLayoutExample;
