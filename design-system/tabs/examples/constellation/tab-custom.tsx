/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Tabs, { TabList, TabPanel, useTab } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customTab: {
		font: token('font.body.small'),
	},
});

const panelStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	flexGrow: 1,
	backgroundColor: token('color.background.neutral'),
	borderRadius: '3px',
	color: token('color.text.subtlest'),
	font: token('font.heading.xxlarge'),
	marginBlockEnd: token('space.100'),
	marginBlockStart: token('space.200'),
	paddingBlockEnd: token('space.400'),
	paddingBlockStart: token('space.400'),
	paddingInlineEnd: token('space.400'),
	paddingInlineStart: token('space.400'),
});

export const Panel = ({ children }: { children: ReactNode }) => (
	<div css={panelStyles}>{children}</div>
);

const CustomTab = ({ label }: { label: string }) => {
	const tabAttributes = useTab();

	return (
		<Box xcss={styles.customTab} {...tabAttributes}>
			{label}
		</Box>
	);
};

const TabCustomExample = () => (
	<Tabs id="custom-tabs">
		<TabList>
			<CustomTab label="Tab 1" />
			<CustomTab label="Tab 2" />
			<CustomTab label="Tab 3" />
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
	</Tabs>
);

export default TabCustomExample;
