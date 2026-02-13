/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { FormattedMessage } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

import { messages } from './messages';
import type { AuditLogTabsProps } from './types';

const styles = cssMap({
	container: {
		paddingInline: token('space.200'),
		paddingBlock: token('space.200'),
	},
});

export default function AuditLogTabs({ testId = 'audit-log-tabs' }: AuditLogTabsProps): JSX.Element {
	return (
		<Box testId={testId}>
			<Tabs id="audit-log-tabs">
				<TabList>
					<Tab><FormattedMessage {...messages.homeTab} /></Tab>
					<Tab><FormattedMessage {...messages.asyncQueriesTab} /></Tab>
				</TabList>
				<TabPanel>
					<Box xcss={styles.container}>
						<Text as="p"><FormattedMessage {...messages.homeTabContent} /></Text>
					</Box>
				</TabPanel>
				<TabPanel>
					<Box xcss={styles.container}>
						<Text as="p"><FormattedMessage {...messages.asyncQueriesTabContent} /></Text>
					</Box>
				</TabPanel>
			</Tabs>
		</Box>
	);
}
