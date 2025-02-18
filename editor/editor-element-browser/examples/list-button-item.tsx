import React from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';
import Heading from '@atlaskit/heading';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import SpreadsheetIcon from '@atlaskit/icon/core/spreadsheet';
import TaskIcon from '@atlaskit/icon/core/task';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { ListButtonItem } from '../src/ui/ListButtonItem';

const innerBoxContainerStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
});

const outerBoxContainerStyles = xcss({
	width: '272px',
	margin: 'auto',
	paddingTop: 'space.200',
});

const items = [
	{
		exampleTitle: 'Without description',
		index: 0,
		title: 'Table',
		description: 'Insert a table',
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <SpreadsheetIcon label="Table" />,
	},
	{
		exampleTitle: 'With description',
		index: 1,
		title: 'Table',
		description: 'Insert a table',
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <SpreadsheetIcon label="Table" />,
		showDescription: true,
	},
	{
		exampleTitle: 'With long description',
		index: 2,
		title: 'Table',
		description: 'Insert a table and be amazed what you can do with it!',
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <SpreadsheetIcon label="Table" />,
		showDescription: true,
	},
	{
		exampleTitle: 'Selected',
		index: 3,
		title: 'Actions',
		description: 'Create and assign action items',
		keyshortcut: makeKeyMapWithCommon('', '[]'),
		isSelected: true,
		renderIcon: () => <TaskIcon label="Actions" />,
	},
	{
		exampleTitle: 'Without shortcut',
		index: 4,
		title: 'Codeblock',
		description: 'Display code with syntax highlighting',
		keyshortcut: undefined,
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
	{
		exampleTitle: 'With NEW Label',
		index: 5,
		title: 'Codeblock',
		description: 'Display code with syntax highlighting',
		keyshortcut: makeKeyMapWithCommon('', '```'),
		attributes: { new: true },
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
];

export default function ListButtonItemExample() {
	return (
		<Box xcss={outerBoxContainerStyles}>
			<Stack space="space.200">
				{items.map((item) => (
					<Stack space="space.100" alignBlock="center" key={item.index}>
						<Heading size="xsmall">{item.exampleTitle}</Heading>
						<Box xcss={innerBoxContainerStyles}>
							<ListButtonItem
								index={item.index}
								title={item.title}
								description={item.description}
								keyshortcut={item.keyshortcut}
								isSelected={item.isSelected}
								attributes={item.attributes}
								showDescription={item.showDescription}
								renderIcon={item.renderIcon}
								onItemSelected={(id) => console.log('onItemSelected', id)}
							/>
						</Box>
					</Stack>
				))}
			</Stack>
		</Box>
	);
}
