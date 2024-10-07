/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import DocQuickLinks from './doc-quick-links';
import ExampleQuickLinks from './example-quick-links';

const containerStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"> [role='tablist']::before": {
			left: 0,
			right: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		"[role='tab']:first-of-type": {
			paddingLeft: 0,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			"&[aria-selected='true']::after": {
				left: 0,
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"> [role='tabpanel']": {
			padding: '2rem 0',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'> div': {
				width: '100%',
			},
		},
	},
});

const quickLinkStyles = xcss({
	flexGrow: 2,
	marginBlock: 'space.negative.150',
	textAlign: 'right',
});

const ContentTabs = ({
	showQuickLinks,
	tabs = [],
}: {
	showQuickLinks?: boolean;
	tabs: { name: string; content: any }[];
}) => (
	<div css={containerStyles}>
		<Tabs id="default">
			<TabList>
				{tabs.map(({ name }, idx: number) => (
					<Tab key={idx}>{name}</Tab>
				))}
				{showQuickLinks && (
					<Box xcss={quickLinkStyles}>
						<Inline alignInline="end" space="space.100">
							<DocQuickLinks />
							<ExampleQuickLinks />
						</Inline>
					</Box>
				)}
			</TabList>
			{tabs.map(({ content }, idx: number) => (
				<TabPanel key={idx}>{content}</TabPanel>
			))}
		</Tabs>
	</div>
);

export default ContentTabs;
