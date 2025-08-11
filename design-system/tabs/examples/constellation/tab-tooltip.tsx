/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const panelStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	flexGrow: 1,
	backgroundColor: token('color.background.neutral'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
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

const TooltipTab = ({ label, tooltip }: { label: string; tooltip: string }) => (
	<Tooltip content={tooltip}>
		<Tab>{label}</Tab>
	</Tooltip>
);

const TabTooltipExample = () => (
	<Tabs id="tooltip-tabs">
		<TabList>
			<TooltipTab label="Tab 1" tooltip="Tooltip for tab 1" />
			<TooltipTab label="Tab 2" tooltip="Tooltip for tab 2" />
			<TooltipTab label="Tab 3" tooltip="Tooltip for tab 3" />
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

export default TabTooltipExample;
