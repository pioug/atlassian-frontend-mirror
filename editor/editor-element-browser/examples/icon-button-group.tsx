import React from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';
import Heading from '@atlaskit/heading';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import SpreadsheetIcon from '@atlaskit/icon/core/spreadsheet';
import TaskIcon from '@atlaskit/icon/core/task';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { IconButtonGroup } from '../src/ui/IconButtonGroup';
import type { ItemData } from '../src/ui/ItemType';

const innerBoxContainerStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
});

const innerBoxContainerNarrowStyles = xcss({
	marginInline: 'space.100',
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
		title: 'Table',
		description: 'Insert a table',
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <SpreadsheetIcon label="Table" />,
	},
	{
		index: 5,
		title: 'Amazing Table',
		description: 'Insert a table and be amazed what you can do with it!',
		keyshortcut: makeKeyMapWithCommon('', 'MOD-SHIFT-T'),
		attributes: { new: true },
		renderIcon: () => <SpreadsheetIcon label="Table" />,
	},
	{
		index: 6,
		title: 'Codeblock',
		description: 'Display code with syntax highlighting',
		keyshortcut: makeKeyMapWithCommon('', '```'),
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
	{
		index: 7,
		title: 'Actions',
		description: 'Create and assign action items',
		keyshortcut: makeKeyMapWithCommon('', '[]'),
		renderIcon: () => <TaskIcon label="Actions" />,
	},
];

export default function CategoryNavButtonExample() {
	return (
		<Box xcss={outerBoxContainerStyles}>
			<Stack space="space.200">
				<Heading size="xsmall">Without separator</Heading>
				<Box xcss={innerBoxContainerStyles}>
					<IconButtonGroup
						id="suggested"
						label="Suggested"
						items={dataItems}
						onItemSelected={(index, categoryId) => {
							console.log(`Item ${index} selected in category ${categoryId}`);
						}}
					/>
				</Box>
				<Heading size="xsmall">With separator</Heading>
				<Box xcss={innerBoxContainerStyles}>
					<IconButtonGroup
						id="suggested"
						label="Suggested"
						items={dataItems}
						hasSeparator
						onItemSelected={(index, categoryId) => {
							console.log(`Item ${index} selected in category ${categoryId}`);
						}}
					/>
				</Box>
				<Heading size="xsmall">Narrow space</Heading>
				<Box xcss={[innerBoxContainerStyles, innerBoxContainerNarrowStyles]}>
					<IconButtonGroup
						id="suggested"
						label="Suggested"
						items={dataItems}
						onItemSelected={(index, categoryId) => {
							console.log(`Item ${index} selected in category ${categoryId}`);
						}}
					/>
				</Box>
			</Stack>
		</Box>
	);
}
