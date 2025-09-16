import React from 'react';

import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

export default [
	<Tabs id="tabs">
		<TabList>
			<Tab>Tab 1</Tab>
			<Tab>Tab 2</Tab>
		</TabList>
		<TabPanel>Content for Tab 1</TabPanel>
		<TabPanel>Content for Tab 2</TabPanel>
	</Tabs>,
];
