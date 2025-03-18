import React from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';
import Heading from '@atlaskit/heading';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import SpreadsheetIcon from '@atlaskit/icon/core/spreadsheet';
import TaskIcon from '@atlaskit/icon/core/task';
import Table from '@atlaskit/icon/glyph/table';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import { IconButtonItem } from '../src/ui/IconButtonItem';

const innerBoxContainerStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
	padding: 'space.100',
});

const outerBoxContainerStyles = xcss({
	width: '76px',
	margin: 'auto',
	paddingTop: 'space.200',
});

const items = [
	{
		exampleTitle: 'Normal',
		index: 0,
		title: 'Table',
		description: 'Insert a table',
		keyshortcut: makeKeyMapWithCommon('', 'SHIFT-ALT-T'),
		renderIcon: () => <SpreadsheetIcon label="Table" />,
	},
	{
		exampleTitle: 'Another',
		index: 1,
		title: 'Codeblock',
		description: 'Display code with syntax highlighting',
		keyshortcut: makeKeyMapWithCommon('', '```'),
		attributes: { new: true },
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
	{
		exampleTitle: 'Long label',
		index: 2,
		title: 'Codeblock with a long label',
		description: 'Display code with syntax highlighting',
		keyshortcut: undefined,
		attributes: { new: true },
		renderIcon: () => <AngleBracketsIcon label="Codeblock" />,
	},
	{
		exampleTitle: 'With large icon',
		index: 3,
		title: 'Table',
		description: 'Insert a table and be amazed what you can do with it!',
		keyshortcut: undefined,
		// will no longer be large after platform-visual-refresh-icons is switched on as changing icon size has been removed
		renderIcon: () => <SpreadsheetIcon LEGACY_fallbackIcon={Table} LEGACY_size="xlarge" label="" />,
	},
	{
		exampleTitle: 'With big image',
		index: 4,
		title: 'Decision Helper',
		description: 'Workflows and notifications for decision making',
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
		exampleTitle: 'Selected',
		index: 5,
		title: 'Actions',
		description: 'Create and assign action items',
		keyshortcut: makeKeyMapWithCommon('', '[]'),
		isSelected: true,
		renderIcon: () => <TaskIcon label="Actions" />,
	},
	{
		exampleTitle: 'Disabled',
		index: 6,
		title: 'Actions',
		description: 'Create and assign action items',
		keyshortcut: makeKeyMapWithCommon('', '[]'),
		isDisabled: true,
		renderIcon: () => <TaskIcon label="Actions" />,
	},
];

export default function IconButtonItemExample() {
	return (
		<Box xcss={outerBoxContainerStyles}>
			<Stack space="space.200">
				{items.map((item) => (
					<Stack space="space.100" alignBlock="center" key={item.index}>
						<Heading size="xsmall">{item.exampleTitle}</Heading>
						<Box xcss={innerBoxContainerStyles}>
							<IconButtonItem
								index={item.index}
								title={item.title}
								description={item.description}
								keyshortcut={item.keyshortcut}
								isSelected={item.isSelected}
								isDisabled={item.isDisabled}
								attributes={item.attributes}
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
