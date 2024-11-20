import React from 'react';

import { Box } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

import { Panel } from './shared';

export default function defaultTabs() {
	return (
		<Box>
			<Tabs
				onChange={(index) => console.log('Selected Tab', index + 1)}
				id="default"
				testId="default"
			>
				<TabList>
					<Tab>Tab 1</Tab>
					<Tab>Tab 2</Tab>
					<Tab>Tab 3</Tab>
					<Tab>Tab 4</Tab>
				</TabList>
				<TabPanel>
					<Panel>This is the content area of the first tab.</Panel>
				</TabPanel>
				<TabPanel>
					<Panel>This is the content area of the second tab.</Panel>
				</TabPanel>
				<TabPanel>
					<Panel>This is the content area of the third tab.</Panel>
				</TabPanel>
				<TabPanel>
					<Panel>This is the content area of the fourth tab.</Panel>
				</TabPanel>
			</Tabs>
		</Box>
	);
}
