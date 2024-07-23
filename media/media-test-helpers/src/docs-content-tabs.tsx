/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Tabs, { Tab, TabList, useTabPanel } from '@atlaskit/tabs';

const panelStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div': {
		width: '100%',
	},
});

type TabItems = {
	name: string;
	content: ReactNode;
};
type DocsContentTabsProps = {
	tabs: TabItems[];
};

const CustomTabPanel = ({ children }: { children: ReactNode }) => {
	const context = useTabPanel();
	return (
		<div css={panelStyle} {...context}>
			{children}
		</div>
	);
};

export const DocsContentTabs: React.FC<DocsContentTabsProps> = ({
	tabs = [],
}: DocsContentTabsProps) => (
	<Tabs id="default">
		<TabList>
			{tabs.map(({ name }, idx: number) => (
				<Tab key={idx}>{name}</Tab>
			))}
		</TabList>
		{tabs.map(({ content }, idx: number) => (
			<CustomTabPanel key={idx}>{content}</CustomTabPanel>
		))}
	</Tabs>
);
