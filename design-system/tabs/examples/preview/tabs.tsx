import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '340px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Tabs id="project-tabs">
					<TabList>
						<Tab>Overview</Tab>
						<Tab>Activity</Tab>
						<Tab>Settings</Tab>
					</TabList>
					<TabPanel>Recent project updates</TabPanel>
					<TabPanel>Activity</TabPanel>
					<TabPanel>Settings</TabPanel>
				</Tabs>
			</Box>
		</IntlProvider>
	);
}
