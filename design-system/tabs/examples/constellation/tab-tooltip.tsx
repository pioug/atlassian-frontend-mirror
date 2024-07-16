/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import Tabs, { Tab, TabList, TabPanel } from '../../src';

const panelStyles = css({
	display: 'flex',
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
