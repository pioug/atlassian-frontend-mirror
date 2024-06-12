import React, { useState } from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

import Tabs, { Tab, TabList, TabPanel } from '../src';
import { type SelectedType } from '../src/types';

import { Panel } from './shared';

export default function TabsControlledExample() {
	const [selected, setSelected] = useState(0);
	const [statusMessage, setStatusMessage] = useState(false);

	const handleUpdate = (index: SelectedType) => {
		setSelected(index);
		index === 3 ? setStatusMessage(true) : setStatusMessage(false);
	};

	return (
		<div>
			<button
				disabled={selected === 3}
				onClick={() => {
					handleUpdate(3);
				}}
				type="button"
			>
				Select the last tab
			</button>
			{statusMessage === true && (
				<VisuallyHidden role="status">The fourth tab has been selected successfully</VisuallyHidden>
			)}
			<Tabs onChange={handleUpdate} selected={selected} id="controlled">
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
		</div>
	);
}
