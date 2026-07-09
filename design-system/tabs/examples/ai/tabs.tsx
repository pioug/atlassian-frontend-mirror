import React from 'react';

import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';

const Example = (): React.JSX.Element => (
	<Tabs id="tabs">
		<TabList>
			<Tab>Tab 1</Tab>
			<Tab>Tab 2</Tab>
		</TabList>
		<TabPanel>Content for Tab 1</TabPanel>
		<TabPanel>Content for Tab 2</TabPanel>
	</Tabs>
);
export default Example;
