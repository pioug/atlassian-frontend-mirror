import React from 'react';

import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

import { Panel } from './shared';

export default function noSpaceForTabs() {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: 400,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: 200,
				margin: `${token('space.200', '16px')} auto`,
				border: `1px dashed ${token('color.border')}`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
			}}
		>
			<Tabs id="no-space-for-tabs" testId="no-space-for-tabs">
				<TabList>
					<Tab>Here is an incredibly super long label, too long really</Tab>
					<Tab>here, a short label</Tab>
				</TabList>
				<TabPanel>
					<Panel>Panel is here</Panel>
				</TabPanel>
				<TabPanel>
					<Panel>Panel is here</Panel>
				</TabPanel>
			</Tabs>
		</div>
	);
}
