import React from 'react';

import Banner from '@atlaskit/banner';
import { cssMap } from '@atlaskit/css';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import Link from '@atlaskit/link';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Dummy } from './common/dummy';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const LayoutExample = (): React.JSX.Element => (
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
