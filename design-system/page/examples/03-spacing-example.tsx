import React from 'react';

import Banner from '@atlaskit/banner';
import { cssMap } from '@atlaskit/css';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import Link from '@atlaskit/link';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Dummy } from './common/dummy';
import VerticalSpace from './common/vertical-space';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const GridSpacingExample = (): React.JSX.Element => (
	<Page testId="page">
		<Banner
			appearance="warning"
			icon={
				<Flex xcss={iconSpacingStyles.space050}>
					<WarningIcon label="Warning" />
				</Flex>
			}
		>
			We are planning on deprecating Page component. We recommend using the Page layout component
			instead.
			<Link target="_blank" href="https://atlassian.design/components/page-layout">
				{' '}
				View page layout documentation
			</Link>
		</Banner>
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
export default GridSpacingExample;
