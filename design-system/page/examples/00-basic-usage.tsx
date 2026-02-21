import React from 'react';

import Banner from '@atlaskit/banner';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import Link from '@atlaskit/link';
import Page, { Grid, GridColumn } from '@atlaskit/page';

const PageBanner = () => {
	return (
		<Banner appearance="warning" icon={<WarningIcon spacing="spacious" label="Warning" />}>
			We are planning on deprecating Page component. We recommend using the Page layout component
			instead.
			<Link target="_blank" href="https://atlassian.design/components/page-layout">
				{' '}
				View page layout documentation
			</Link>
		</Banner>
	);
};

const BasicExample = (): React.JSX.Element => (
	<Page testId="page" banner={<PageBanner />} isBannerOpen>
		<Grid testId="grid">
			<GridColumn medium={8}>
				<h1>Main heading</h1>
				<p>
					Lorem ipsum dolor sit amet and consectetur adipisicing elit. Blanditiis voluptatum
					perspiciatis doloribus dignissimos accusamus commodi, nobis ut, error iusto, quas vitae
					nesciunt consequatur possimus labore! Mollitia est quis minima asperiores.
				</p>
			</GridColumn>
			<GridColumn medium={4}>
				<h2>Sidebar</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis voluptatum
					perspiciatis doloribus dignissimos accusamus commodi, nobis ut, error iusto, quas vitae
					nesciunt consequatur possimus labore! Mollitia est quis minima asperiores.
				</p>
			</GridColumn>
			<GridColumn>
				<h2>Content below which takes up remaining space</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis voluptatum
					perspiciatis doloribus dignissimos accusamus commodi, nobis ut, error iusto, quas vitae
					nesciunt consequatur possimus labore! Mollitia est quis minima asperiores.
				</p>
			</GridColumn>
		</Grid>
	</Page>
);
export default BasicExample;
