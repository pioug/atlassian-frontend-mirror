import React from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import SpreadsheetIcon from '@atlaskit/icon/core/spreadsheet';
import TaskIcon from '@atlaskit/icon/core/task';
import Table from '@atlaskit/icon/glyph/table';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { ExpandablePanel } from '../src/ui/ExpandablePanel';
import { ItemData } from '../src/ui/ItemType';

const innerBoxContainerStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
});

const outerBoxContainerStyles = xcss({
	width: '320px',
	margin: 'auto',
	paddingTop: 'space.200',
});

const dataItems: ItemData[] = [
	{
		index: 0,
		title: 'Table',
		description: 'Insert a table',
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <SpreadsheetIcon label="Table" />,
	},
	{
		index: 1,
		title: 'Amazing Table',
		description: 'Insert a table and be amazed what you can do with it!',
		keyshortcut: makeKeyMapWithCommon('', 'MOD-SHIFT-T'),
		attributes: { new: true },
		renderIcon: () => <SpreadsheetIcon label="Table" />,
	},
	{
		index: 2,
		title: 'Codeblock',
		description: 'Display code with syntax highlighting',
		keyshortcut: makeKeyMapWithCommon('', '```'),
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
	{
		index: 3,
		title: 'Actions',
		description: 'Create and assign action items',
		keyshortcut: makeKeyMapWithCommon('', '[]'),
		renderIcon: () => <TaskIcon label="Actions" />,
	},
	{
		index: 4,
		title: 'Large Table',
		description: 'Placeholder for a 3rd party table',
		showDescription: true,
		// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
		renderIcon: () => <Table size="xlarge" label="" />,
	},
];

const categoryItems = [
	{
		exampleTitle: 'Normal',
		id: 'random',
		label: 'Random',
		items: dataItems,
	},
];

export default function CategoryNavButtonExample() {
	return (
		<Box xcss={outerBoxContainerStyles}>
			<Stack space="space.200">
				{categoryItems.map((item) => (
					<Stack space="space.100" alignBlock="center" key={item.id}>
						<Box xcss={innerBoxContainerStyles}>
							<ExpandablePanel
								id={item.id}
								label={item.label}
								items={item.items}
								onItemSelected={(index, categoryId) => {
									console.log(`Item ${index} selected in category ${categoryId}`);
								}}
								onViewAllSelected={(categoryId) => {
									console.log(`View all selected in category ${categoryId}`);
								}}
							/>
						</Box>
					</Stack>
				))}
			</Stack>
		</Box>
	);
}
