/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Tabs, { Tab, TabList, useTabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

const customPanelStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		// TODO (AFB-874): Disabling due to fixing for expand-spacing-property produces further ESLint errors
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
		padding: token('space.250', '20px'),
		flexDirection: 'column',
	},
});

const CustomTabPanel = ({ heading, body }: { heading: string; body: string }) => {
	const tabPanelAttributes = useTabPanel();

	return (
		<span css={customPanelStyles} {...tabPanelAttributes}>
			<h3>{heading}</h3>
			<p>{body}</p>
		</span>
	);
};

const CustomTabPanels = () => (
	<Tabs onChange={(index) => console.log('Selected Tab', index + 1)} id="custom-panel">
		<TabList>
			<Tab>Tab 1</Tab>
			<Tab>Tab 2</Tab>
			<Tab>Tab 3</Tab>
			<Tab>Tab 4</Tab>
		</TabList>
		<CustomTabPanel heading="Tab One" body="This is tab one." />
		<CustomTabPanel heading="Tab Two" body="This is tab two." />
		<CustomTabPanel heading="Tab Three" body="This is tab three." />
		<CustomTabPanel heading="Tab Four" body="This is tab four." />
	</Tabs>
);

export default CustomTabPanels;
