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
	borderRadius: '3px',
	color: token('color.text.subtlest'),
	font: token('font.heading.xxlarge'),
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.200', '16px'),
	paddingBlockEnd: token('space.400', '32px'),
	paddingBlockStart: token('space.400', '32px'),
	paddingInlineEnd: token('space.400', '32px'),
	paddingInlineStart: token('space.400', '32px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		paddingBlockEnd: token('space.400', '32px'),
		paddingBlockStart: token('space.400', '32px'),
		paddingInlineEnd: token('space.400', '32px'),
		paddingInlineStart: token('space.400', '32px'),
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
