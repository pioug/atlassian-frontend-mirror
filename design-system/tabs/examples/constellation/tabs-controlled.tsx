/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives/compiled';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import { type SelectedType } from '@atlaskit/tabs/types';
import { token } from '@atlaskit/tokens';

const panelStyles = css({
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
});

export const Panel = ({ children, testId }: { children: ReactNode; testId?: string }) => (
	<div css={panelStyles} data-testid={testId}>
		{children}
	</div>
);

export default function TabsControlledExample() {
	const [selected, setSelected] = useState(0);

	const handleUpdate = useCallback((index: SelectedType) => setSelected(index), [setSelected]);

	return (
		<Box>
			<Tabs onChange={handleUpdate} selected={selected} id="controlled">
				<TabList>
					<Tab>Tab 1</Tab>
					<Tab>Tab 2</Tab>
					<Tab>Tab 3</Tab>
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
			<Button isDisabled={selected === 2} onClick={() => handleUpdate(2)}>
				Select the last tab
			</Button>
		</Box>
	);
}
