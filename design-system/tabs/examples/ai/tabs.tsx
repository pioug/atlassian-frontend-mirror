import React from 'react';

import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

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
