import React from 'react';

import { IntlProvider } from 'react-intl-next';

import FeedbackIcon from '@atlaskit/icon/core/feedback';
import Link from '@atlaskit/link';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { fg } from '@atlaskit/platform-feature-flags';

import Panel from '../src';

const Header = (
	<h1>
		Component based header <FeedbackIcon label="feedback" color="currentColor" spacing="spacious" />
	</h1>
);

export default (): React.JSX.Element => (
	<IntlProvider locale="en">
		<Page>
			<Grid layout="fixed">
				<GridColumn medium={2} />
				<GridColumn medium={8}>
					<Panel header={Header} isDefaultExpanded>
						<p>
							Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
							consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem
							ullamco minim nostrud elit officia tempor esse quis.
						</p>
						<p>
							Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor
							cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt
							cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor
							eiusmod. Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur proident
							Lorem eiusmod et. Culpa deserunt nostrud ad veniam.{' '}
							{fg('dst-a11y__replace-anchor-with-link__bitbucket-core') ? (
								<Link href="https://atlassian.design/">Test link for tabbing</Link>
							) : (
								// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
								<a href="https://atlassian.design/">Test link for tabbing</a>
							)}
						</p>
					</Panel>
				</GridColumn>
			</Grid>
		</Page>
	</IntlProvider>
);
