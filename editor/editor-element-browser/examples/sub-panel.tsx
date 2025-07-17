import React from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import GridIcon from '@atlaskit/icon/core/grid';
import TaskIcon from '@atlaskit/icon/core/task';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { type ItemData } from '../src/ui/ItemType';
import { ListButtonGroup } from '../src/ui/ListButtonGroup';
import { SubPanelWithBackButton } from '../src/ui/SubPanel';

const innerBoxContainerStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
	padding: 'space.100',
});

const outerBoxContainerStyles = xcss({
	width: '320px',
	margin: 'auto',
	paddingTop: 'space.200',
});

const childrenStyles = xcss({ paddingLeft: 'space.200' });

const dataItems: ItemData[] = [
	{
		index: 0,
		title: 'Table',
		description: 'Insert a table',
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <GridIcon label="Table" />,
	},
	{
		index: 1,
		title: 'Amazing Table',
		description: 'Insert a table and be amazed what you can do with it!',
		keyshortcut: makeKeyMapWithCommon('', 'MOD-SHIFT-T'),
		attributes: { new: true },
		renderIcon: () => <GridIcon label="Table" />,
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
		keyshortcut: undefined,
		// will no longer be large after platform-visual-refresh-icons is switched on as changing icon size has been removed
		renderIcon: () => <GridIcon label="" />,
	},
];

export default function CategoryNavButtonExample() {
	return (
		<Box xcss={outerBoxContainerStyles}>
			<Stack space="space.100" alignBlock="center">
				<Box xcss={innerBoxContainerStyles}>
					<SubPanelWithBackButton
						label={'Media'}
						buttonLabel="Back to all items"
						onClick={() => {
							console.log(`Back clicked`);
						}}
					>
						<Box xcss={childrenStyles}>Children</Box>
					</SubPanelWithBackButton>
				</Box>
				<Box xcss={innerBoxContainerStyles}>
					<SubPanelWithBackButton
						label={'Media'}
						buttonLabel="Back to all items"
						onClick={() => {
							console.log(`Back clicked`);
						}}
					>
						<ListButtonGroup
							id="media"
							items={dataItems}
							onItemSelected={(index, categoryId) => {
								console.log(`Item ${index} selected in category ${categoryId}`);
							}}
						/>
					</SubPanelWithBackButton>
				</Box>
			</Stack>
		</Box>
	);
}
