import React from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';
import Heading from '@atlaskit/heading';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import GridIcon from '@atlaskit/icon/core/grid';
import TaskIcon from '@atlaskit/icon/core/task';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { ListButtonItem, ViewAllButtonItem } from '../src/ui/ListButtonItem';

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
		renderIcon: () => <GridIcon label="Table" />,
	},
	{
		exampleTitle: 'With description',
		index: 1,
		title: 'Table',
		description: 'Insert a table',
		showDescription: true,
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <GridIcon label="Table" />,
	},
	{
		exampleTitle: 'With long description',
		index: 2,
		title: 'Table',
		description: 'Insert a table and be amazed what you can do with it!',
		showDescription: true,
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <GridIcon label="Table" />,
	},
	{
		exampleTitle: 'Without shortcut',
		index: 3,
		title: 'Codeblock',
		description: 'Display code with syntax highlighting',
		keyshortcut: undefined,
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
	{
		exampleTitle: 'With large icon',
		index: 4,
		title: 'Table',
		description: 'Insert a table and be amazed what you can do with it!',
		showDescription: true,
		keyshortcut: undefined,
		// will no longer be large after platform-visual-refresh-icons is switched on as changing icon size has been removed
		renderIcon: () => <GridIcon label="" />,
	},
	{
		exampleTitle: 'With big image',
		index: 5,
		title: 'Decision Helper',
		description: 'Workflows and notifications for decision making',
		showDescription: true,
		keyshortcut: undefined,
		renderIcon: () => (
			<img
				data-testid="macro-custom-icon-img"
				alt="Decision Helper"
				src="https://icon.cdn.prod.atlassian-dev.net/d31527a9-9b37-4734-916a-eb6170e5e701/d9cf229a-4c39-4f0d-96a7-90986570c551/8e8b96b2-4a12-401d-8430-29f38041a859/main/images/macro-icon.png"
				width="100%"
			/>
		),
	},
	{
		exampleTitle: 'With NEW label',
		index: 6,
		title: 'Codeblock',
		description: 'Display code with syntax highlighting',
		keyshortcut: makeKeyMapWithCommon('', '```'),
		attributes: { new: true },
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
	{
		exampleTitle: 'Selected',
		index: 7,
		title: 'Actions',
		description: 'Create and assign action items',
		keyshortcut: makeKeyMapWithCommon('', '[]'),
		isSelected: true,
		renderIcon: () => <TaskIcon label="Actions" />,
	},
	{
		exampleTitle: 'Disabled',
		index: 8,
		title: 'Actions',
		description: 'Create and assign action items',
		keyshortcut: makeKeyMapWithCommon('', '[]'),
		isDisabled: true,
		renderIcon: () => <TaskIcon label="Actions" />,
	},
	{
		exampleTitle: 'No Icon',
		index: 9,
		title: 'Actions',
		description: 'Create and assign action items',
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
								isDisabled={item.isDisabled}
								attributes={item.attributes}
								showDescription={item.showDescription}
								renderIcon={item.renderIcon}
								onItemSelected={(id) => console.log('onItemSelected', id)}
							/>
						</Box>
					</Stack>
				))}
				<Stack space="space.100" alignBlock="center">
					<Heading size="xsmall">View All Button</Heading>
					<Box xcss={innerBoxContainerStyles}>
						<ViewAllButtonItem
							label="View all inserts"
							onClick={() => console.log('view all clicked')}
						/>
					</Box>
				</Stack>
			</Stack>
		</Box>
	);
}
