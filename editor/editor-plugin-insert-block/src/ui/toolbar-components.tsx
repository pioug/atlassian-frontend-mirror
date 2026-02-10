import React from 'react';

import {
	INSERT_BLOCK_SECTION,
	TASK_LIST_GROUP,
	MEDIA_GROUP,
	INSERT_BLOCK_SECTION_RANK,
	TASK_LIST_BUTTON,
	TASK_LIST_GROUP_RANK,
	MEDIA_BUTTON,
	MENTION_GROUP,
	MEDIA_GROUP_RANK,
	MENTION_BUTTON,
	MENTION_GROUP_RANK,
	EMOJI_GROUP,
	EMOJI_BUTTON,
	EMOJI_GROUP_RANK,
	LAYOUT_GROUP,
	LAYOUT_BUTTON,
	LAYOUT_GROUP_RANK,
	TABLE_GROUP_RANK,
	TABLE_BUTTON,
	TABLE_GROUP,
	TABLE_SIZE_PICKER,
	INSERT_GROUP,
	INSERT_BUTTON,
	INSERT_GROUP_RANK,
	CODE_BLOCK_GROUP,
	CODE_BLOCK_BUTTON,
	CODE_BLOCK_GROUP_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Show, ToolbarButtonGroup, type Breakpoint } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { InsertBlockPlugin } from '../insertBlockPluginType';
import type { InsertBlockPluginOptions } from '../types';

import { CodeBlockButton } from './toolbar-components/CodeBlockButton';
import { resolveToolbarConfig } from './toolbar-components/config-resolver';
import { EmojiButton } from './toolbar-components/EmojiButton';
import { ImageButton } from './toolbar-components/ImageButton';
import { InsertButton } from './toolbar-components/InsertButton';
import { LayoutButton } from './toolbar-components/LayoutButton';
import { MediaButton } from './toolbar-components/MediaButton';
import { MentionButton } from './toolbar-components/MentionButton';
import { TableButton } from './toolbar-components/TableButton';
import { TableSizePicker } from './toolbar-components/TableSizePicker';
import { TaskListButton } from './toolbar-components/TaskListButton';

type GetToolbarComponentsProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	onInsertBlockType?: (name: string) => Command;
	options: InsertBlockPluginOptions;
};

/**
 * Updated toolbar components function that uses the new configuration resolver.
 * This function replaces the hardcoded approach with a config-driven one.
 */
export const getToolbarComponents = ({
	api,
	options,
	onInsertBlockType,
}: GetToolbarComponentsProps): RegisterComponent[] => {
	const config = resolveToolbarConfig(options);
	const components: RegisterComponent[] = [];

	// Helper function to create responsive wrapper component
	const createResponsiveComponent = (showAt?: Breakpoint) => {
		return ({ children }: { children: React.ReactNode }) => (
			<Show above={showAt || 'lg'}>
				<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
			</Show>
		);
	};

	// TaskList Group
	if (config.taskList?.enabled) {
		components.push({
			type: TASK_LIST_GROUP.type,
			key: TASK_LIST_GROUP.key,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[TASK_LIST_GROUP.key],
				},
			],
			component: createResponsiveComponent(config.taskList?.showAt),
		});

		components.push({
			type: TASK_LIST_BUTTON.type,
			key: TASK_LIST_BUTTON.key,
			parents: [
				{
					type: TASK_LIST_GROUP.type,
					key: TASK_LIST_GROUP.key,
					rank: TASK_LIST_GROUP_RANK[TASK_LIST_BUTTON.key],
				},
			],
			component: () => <TaskListButton api={api} />,
		});
	}

	// Media Group
	if (config.media?.enabled) {
		components.push({
			type: MEDIA_GROUP.type,
			key: MEDIA_GROUP.key,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[MEDIA_GROUP.key],
				},
			],
			component: createResponsiveComponent(config.media?.showAt),
		});

		components.push({
			type: MEDIA_BUTTON.type,
			key: MEDIA_BUTTON.key,
			parents: [
				{
					type: MEDIA_GROUP.type,
					key: MEDIA_GROUP.key,
					rank: MEDIA_GROUP_RANK[MEDIA_BUTTON.key],
				},
			],
			component: () => (!!api?.imageUpload ? <ImageButton api={api} /> : <MediaButton api={api} />),
		});
	}

	// CodeBlock Group
	if (config.codeBlock?.enabled) {
		components.push({
			type: CODE_BLOCK_GROUP.type,
			key: CODE_BLOCK_GROUP.key,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[CODE_BLOCK_GROUP.key],
				},
			],
			component: createResponsiveComponent(config.codeBlock?.showAt),
		});

		components.push({
			type: CODE_BLOCK_BUTTON.type,
			key: CODE_BLOCK_BUTTON.key,
			parents: [
				{
					type: CODE_BLOCK_GROUP.type,
					key: CODE_BLOCK_GROUP.key,
					rank: CODE_BLOCK_GROUP_RANK[CODE_BLOCK_BUTTON.key],
				},
			],
			component: () => <CodeBlockButton api={api} />,
		});
	}

	// Mention Group
	if (config.mention?.enabled) {
		components.push({
			type: MENTION_GROUP.type,
			key: MENTION_GROUP.key,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[MENTION_GROUP.key],
				},
			],
			component: createResponsiveComponent(config.mention.showAt),
		});

		components.push({
			type: MENTION_BUTTON.type,
			key: MENTION_BUTTON.key,
			parents: [
				{
					type: MENTION_GROUP.type,
					key: MENTION_GROUP.key,
					rank: MENTION_GROUP_RANK[MENTION_BUTTON.key],
				},
			],
			component: () => <MentionButton api={api} />,
		});
	}

	// Emoji Group
	if (config.emoji?.enabled) {
		components.push({
			type: EMOJI_GROUP.type,
			key: EMOJI_GROUP.key,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[EMOJI_GROUP.key],
				},
			],
			component: createResponsiveComponent(config.emoji.showAt),
		});

		components.push({
			type: EMOJI_BUTTON.type,
			key: EMOJI_BUTTON.key,
			parents: [
				{
					type: EMOJI_GROUP.type,
					key: EMOJI_GROUP.key,
					rank: EMOJI_GROUP_RANK[EMOJI_BUTTON.key],
				},
			],
			component: () => <EmojiButton api={api} />,
		});
	}

	// Layout Group
	if (config.layout?.enabled) {
		components.push({
			type: LAYOUT_GROUP.type,
			key: LAYOUT_GROUP.key,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[LAYOUT_GROUP.key],
				},
			],
			component: createResponsiveComponent(config.layout.showAt),
		});

		components.push({
			type: LAYOUT_BUTTON.type,
			key: LAYOUT_BUTTON.key,
			parents: [
				{
					type: LAYOUT_GROUP.type,
					key: LAYOUT_GROUP.key,
					rank: LAYOUT_GROUP_RANK[LAYOUT_BUTTON.key],
				},
			],
			component: () => <LayoutButton api={api} />,
		});
	}

	// Table Group
	if (config.table?.enabled) {
		components.push({
			type: TABLE_GROUP.type,
			key: TABLE_GROUP.key,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[TABLE_GROUP.key],
				},
			],
			component: createResponsiveComponent(config.table.showAt),
		});

		components.push({
			type: TABLE_BUTTON.type,
			key: TABLE_BUTTON.key,
			parents: [
				{
					type: TABLE_GROUP.type,
					key: TABLE_GROUP.key,
					rank: TABLE_GROUP_RANK[TABLE_BUTTON.key],
				},
			],
			component: () => <TableButton api={api} />,
		});

		if (options.tableSelectorSupported) {
			components.push({
				type: TABLE_SIZE_PICKER.type,
				key: TABLE_SIZE_PICKER.key,
				parents: [
					{
						type: TABLE_GROUP.type,
						key: TABLE_GROUP.key,
						rank: TABLE_GROUP_RANK[TABLE_SIZE_PICKER.key],
					},
				],
				component: () => (
					<TableSizePicker api={api} tableSelectorSupported={options.tableSelectorSupported} />
				),
			});
		}
	}

	// Insert Group
	if (config.insert?.enabled) {
		const createInsertButtonComponent = (breakpoint: Breakpoint | null) => {
			return () => (
				<InsertButton
					api={api}
					breakpoint={breakpoint}
					toolbarConfig={config}
					showElementBrowserLink={options.showElementBrowserLink}
					tableSelectorSupported={options.tableSelectorSupported}
					onInsertBlockType={onInsertBlockType}
					nativeStatusSupported={options.nativeStatusSupported}
					horizontalRuleEnabled={options.horizontalRuleEnabled}
					expandEnabled={options.allowExpand}
					insertMenuItems={options.insertMenuItems}
					numberOfButtons={0}
				/>
			);
		};

		components.push({
			type: INSERT_GROUP.type,
			key: `${INSERT_GROUP.key}-none`,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[INSERT_GROUP.key],
				},
			],
			component: ({ children }) => (
				<Show below="sm">
					<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
				</Show>
			),
		});

		components.push({
			type: INSERT_BUTTON.type,
			key: INSERT_BUTTON.key,
			parents: [
				{
					type: INSERT_GROUP.type,
					key: `${INSERT_GROUP.key}-none`,
					rank: INSERT_GROUP_RANK[INSERT_BUTTON.key],
				},
			],
			component: createInsertButtonComponent(null),
		});

		components.push({
			type: INSERT_GROUP.type,
			key: `${INSERT_GROUP.key}-sm`,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[INSERT_GROUP.key],
				},
			],
			component: ({ children }) => (
				<Show only="sm">
					<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
				</Show>
			),
		});

		components.push({
			type: INSERT_BUTTON.type,
			key: INSERT_BUTTON.key,
			parents: [
				{
					type: INSERT_GROUP.type,
					key: `${INSERT_GROUP.key}-sm`,
					rank: INSERT_GROUP_RANK[INSERT_BUTTON.key],
				},
			],
			component: createInsertButtonComponent('sm'),
		});

		components.push({
			type: INSERT_GROUP.type,
			key: `${INSERT_GROUP.key}-md`,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[INSERT_GROUP.key],
				},
			],
			component: ({ children }) => (
				<Show only="md">
					<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
				</Show>
			),
		});

		components.push({
			type: INSERT_BUTTON.type,
			key: INSERT_BUTTON.key,
			parents: [
				{
					type: INSERT_GROUP.type,
					key: `${INSERT_GROUP.key}-md`,
					rank: INSERT_GROUP_RANK[INSERT_BUTTON.key],
				},
			],
			component: createInsertButtonComponent('md'),
		});

		components.push({
			type: INSERT_GROUP.type,
			key: `${INSERT_GROUP.key}-lg`,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[INSERT_GROUP.key],
				},
			],
			component: ({ children }) => (
				<Show only="lg">
					<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
				</Show>
			),
		});

		components.push({
			type: INSERT_BUTTON.type,
			key: INSERT_BUTTON.key,
			parents: [
				{
					type: INSERT_GROUP.type,
					key: `${INSERT_GROUP.key}-lg`,
					rank: INSERT_GROUP_RANK[INSERT_BUTTON.key],
				},
			],
			component: createInsertButtonComponent('lg'),
		});

		components.push({
			type: INSERT_GROUP.type,
			key: `${INSERT_GROUP.key}-xl`,
			parents: [
				{
					type: INSERT_BLOCK_SECTION.type,
					key: INSERT_BLOCK_SECTION.key,
					rank: INSERT_BLOCK_SECTION_RANK[INSERT_GROUP.key],
				},
			],
			component: ({ children }) => (
				<Show only="xl">
					<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
				</Show>
			),
		});

		components.push({
			type: INSERT_BUTTON.type,
			key: INSERT_BUTTON.key,
			parents: [
				{
					type: INSERT_GROUP.type,
					key: `${INSERT_GROUP.key}-xl`,
					rank: INSERT_GROUP_RANK[INSERT_BUTTON.key],
				},
			],
			component: createInsertButtonComponent('xl'),
		});
	}

	return components;
};
