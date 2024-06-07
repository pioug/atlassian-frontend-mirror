/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';

const styles = css({
	paddingTop: '1rem',
	'> div': {
		"> [role='tablist']::before": {
			left: 0,
			right: 0,
		},
		"[role='tab']:first-of-type": {
			paddingLeft: 0,
			"&[aria-selected='true']::after": {
				left: 0,
			},
		},
		"> [role='tabpanel']": {
			padding: '2rem 0',
			'> div': {
				width: '100%',
			},
		},
	},
});

type TabItems = {
	name: string;
	content: any;
};
type DocsWrapperProps = {
	tabs: TabItems[];
};

const ContentTabs: React.FC<DocsWrapperProps> = ({ tabs = [] }: DocsWrapperProps) => (
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

export default ContentTabs;
