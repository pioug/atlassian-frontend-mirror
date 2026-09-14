import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';
import Tabs from '@atlaskit/tabs/tabs';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';

import QuickLinks from './quick-links';

const ContentTabs = ({
	showQuickLinks,
	tabs = [],
}: {
	showQuickLinks?: boolean;
	tabs: { content: any; name: string }[];
}): React.JSX.Element => (
	<Tabs id="content-tab">
		<TabList>
			{tabs.map(({ name }, idx: number) => (
				<Tab key={idx}>{name}</Tab>
			))}
			{showQuickLinks && <QuickLinks />}
		</TabList>
		{tabs.map(({ content }, idx: number) => (
			<TabPanel key={idx}>
				<Box paddingBlockStart="space.200">{content}</Box>
			</TabPanel>
		))}
	</Tabs>
);

export default ContentTabs;
