import React from 'react';

import EditionsIcon from '@atlaskit/icon-lab/core/editions';
import IconTile from '@atlaskit/icon/icon-tile';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';

import { Panel } from './shared';

export default function iconTileInTab(): React.JSX.Element {
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
					<Tab>
						<Inline space="space.050">
							Insights
							<IconTile appearance="purple" size="xsmall" icon={EditionsIcon} label="Upgrade" />
						</Inline>
					</Tab>
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
