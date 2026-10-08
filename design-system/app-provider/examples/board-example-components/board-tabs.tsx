/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type JSX, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import BoardIcon from '@atlaskit/icon/core/board';
import TimelineIcon from '@atlaskit/icon/core/timeline';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Text } from '@atlaskit/primitives/compiled/text';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';
import { token } from '@atlaskit/tokens';

const tabsStyles = cssMap({
	tabs: {
		paddingInline: token('space.200'),
		paddingBlockStart: token('space.200'),
		position: 'relative',
		zIndex: 1,
	},
});

interface TabItemProps {
	icon: React.ReactNode;
	label: string;
}

const TabItem = ({ icon, label }: TabItemProps) => (
	<Inline space="space.050" alignBlock="center">
		{icon}
		<Text>{label}</Text>
	</Inline>
);

const TAB_LABELS = ['Timeline', 'Board', 'Backlog', 'List'];

export const BoardTabs = (): JSX.Element => {
	const [selectedTab, setSelectedTab] = useState(1);

	return (
		<Box xcss={tabsStyles.tabs}>
			<Tabs id="board-tabs" selected={selectedTab} onChange={(index) => setSelectedTab(index)}>
				<TabList>
					<Tab>
						<TabItem icon={<TimelineIcon label="Timeline" />} label="Timeline" />
					</Tab>
					<Tab>
						<TabItem icon={<BoardIcon label="Board" />} label="Board" />
					</Tab>
					<Tab>
						<TabItem icon={<AlignTextLeftIcon label="Backlog" />} label="Backlog" />
					</Tab>
					<Tab>
						<TabItem icon={<BoardIcon label="List" />} label="List" />
					</Tab>
				</TabList>
				{/*
				 * Each tab needs a panel for its `aria-controls` to point at. The board below is
				 * the content for every view in this example, so the panels are empty.
				 */}
				{TAB_LABELS.map((label) => (
					<TabPanel key={label}>{null}</TabPanel>
				))}
			</Tabs>
		</Box>
	);
};
