/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Tabs, { Tab, TabList, TabPanel, useTab } from '@atlaskit/tabs';
import Tooltip from '@atlaskit/tooltip';

import { Panel } from './shared';

/**
 * This custom component wraps a tooltip around the tab item
 */
const TooltipTab = ({
	label,
	tooltip,
	testId,
}: {
	label: string;
	tooltip: string;
	testId: string;
}) => (
	<Tooltip content={tooltip}>
		<Tab testId={testId}>{label}</Tab>
	</Tooltip>
);

const lintTabStyles = css({
	textDecoration: 'none',
	'&:hover': {
		textDecoration: 'none',
	},
});
/**
 * This custom component makes the tab items function like regular links
 */
const LinkTab = ({ label, href }: { label: string; href: string }) => {
	// We also remove the onKeyDown handler and tabIndex attribute
	// from elementProps to opt out of default keyboard navigation
	const { onKeyDown, tabIndex, ...tabAttributes } = useTab();

	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
		<a href={href} css={lintTabStyles} {...tabAttributes}>
			{label}
		</a>
	);
};

const href = 'http://atlassian.design';

const CustomTabComponent: () => JSX.Element = () => (
	<div id="test-container">
		<h3>Tabs with tooltips</h3>
		<Tabs onChange={(index) => console.log('Selected Tab', index + 1)} id="tooltip-tabs">
			<TabList>
				<TooltipTab testId="tooltip-tab1" label="Tab 1" tooltip="Tooltip for tab 1" />
				<TooltipTab testId="tooltip-tab2" label="Tab 2" tooltip="Tooltip for tab 2" />
				<TooltipTab testId="tooltip-tab3" label="Tab 3" tooltip="Tooltip for tab 3" />
				<TooltipTab testId="tooltip-tab4" label="Tab 4" tooltip="Tooltip for tab 4" />
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
		<h3>Tabs as links</h3>
		<Tabs id="link-tabs">
			<TabList>
				<LinkTab label="Tab 1" href={href} />
				<LinkTab label="Tab 2" href={href} />
				<LinkTab label="Tab 3" href={href} />
				<LinkTab label="Tab 4" href={href} />
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

export default CustomTabComponent;
