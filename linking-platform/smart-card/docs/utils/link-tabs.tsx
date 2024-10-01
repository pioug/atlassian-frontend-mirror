/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { token } from '@atlaskit/tokens';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"> div > [role='tablist']": {
		flexWrap: 'wrap',
		justifyContent: 'center',
		marginBlockEnd: '1rem',
	},
	// // eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	// "> div > [role='tablist']::before": {
	// 	backgroundColor: 'unset',
	// },
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	"> div > [role='tablist'] > [role='tab']": {
		color: token('color.link'),
	},
});

const LinkTabs = ({ tabs = [] }: { tabs: { name: string; content: any }[] }) => {
	return (
		<div css={styles}>
			<Tabs id="default">
				<TabList>
					{tabs.map(({ name }, idx: number) => (
						<Tab key={idx}>{name}</Tab>
					))}
				</TabList>
				{tabs.map(({ content }, idx: number) => (
					<TabPanel key={idx}>{content}</TabPanel>
				))}
			</Tabs>
		</div>
	);
};

export default LinkTabs;
