/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';
import Tabs, { Tab, TabList, useTabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

const customPanelStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	flexGrow: 1,
	backgroundColor: token('color.background.neutral'),
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	color: token('color.text.subtlest'),
	font: token('font.heading.xxlarge'),
	marginBlockEnd: token('space.100'),
	marginBlockStart: token('space.200'),
	paddingBlockEnd: token('space.400'),
	paddingBlockStart: token('space.400'),
	paddingInlineEnd: token('space.400'),
	paddingInlineStart: token('space.400'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		paddingBlockEnd: token('space.400'),
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
});

const CustomTabPanel = ({ heading, body }: { heading: string; body: string }) => {
	const tabPanelAttributes = useTabPanel();

	return (
		<div css={customPanelStyles} {...tabPanelAttributes}>
			<Box as="span">{heading}</Box>
			<p>{body}</p>
		</div>
	);
};

const TabPanelCustomExample = () => (
	<Tabs id="custom-panel">
		<TabList>
			<Tab>Tab 1</Tab>
			<Tab>Tab 2</Tab>
			<Tab>Tab 3</Tab>
		</TabList>
		<CustomTabPanel heading="One" body="Body of tab one" />
		<CustomTabPanel heading="Two" body="Body of tab two" />
		<CustomTabPanel heading="Three" body="Body of tab three" />
	</Tabs>
);

export default TabPanelCustomExample;
