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
	// TODO (AFB-874): Disabling due to fixing for expand-spacing-property produces further ESLint errors
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: token('space.400', '32px'),
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	flexGrow: 1,
	backgroundColor: token('color.background.neutral'),
	borderRadius: '3px',
	color: token('color.text.subtlest'),
	font: token('font.heading.xxlarge'),
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.200', '16px'),
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
