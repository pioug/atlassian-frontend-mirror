import React from 'react';

import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';

import CustomTabs from './constellation/tab-custom';
import { Panel } from './shared';

export default function testing(): React.JSX.Element {
	const isCustomTabs =
		typeof window !== 'undefined' &&
		new URLSearchParams(window.location.search).get('custom-tabs') === 'true';

	if (isCustomTabs) {
		return <CustomTabs />;
	}

	return (
		<Tabs
			onChange={(index) => {
				console.log('selected index: ', index);
			}}
			testId="tabs"
			id="testing"
		>
			<TabList>
				<Tab testId="tab-1">Tab 1</Tab>
				<Tab testId="tab-2">Tab 2</Tab>
				<Tab testId="tab-3">Tab 3</Tab>
				<Tab testId="tab-4">Tab 4</Tab>
			</TabList>
			<TabPanel testId="tab-panel-1">
				<Panel>One</Panel>
			</TabPanel>
			<TabPanel testId="tab-panel-2">
				<Panel>Two</Panel>
			</TabPanel>
			<TabPanel testId="tab-panel-3">
				<Panel>Three</Panel>
			</TabPanel>
			<TabPanel testId="tab-panel-4">
				<Panel>Four</Panel>
			</TabPanel>
		</Tabs>
	);
}
