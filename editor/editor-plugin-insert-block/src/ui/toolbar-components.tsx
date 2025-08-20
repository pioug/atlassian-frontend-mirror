import React from 'react';

import {
	INSERT_BLOCK_SECTION,
	TASK_LIST_GROUP,
	MEDIA_GROUP,
	TOOLBAR_RANK,
	TOOLBARS,
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
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { InsertBlockPlugin } from '../insertBlockPluginType';

import { EmojiButton } from './toolbar-components/EmojiButton';
import { ImageButton } from './toolbar-components/ImageButton';
import { LayoutButton } from './toolbar-components/LayoutButton';
import { MediaButton } from './toolbar-components/MediaButton';
import { MentionButton } from './toolbar-components/MentionButton';
import { TableButton } from './toolbar-components/TableButton';
import { TableSizePicker } from './toolbar-components/TableSizePicker';
import { TaskListButton } from './toolbar-components/TaskListButton';

type GetToolbarComponentsProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	tableSelectorSupported?: boolean;
	toolbarShowPlusInsertOnly?: boolean;
};

export const getToolbarComponents = ({
	api,
	tableSelectorSupported,
	toolbarShowPlusInsertOnly,
}: GetToolbarComponentsProps): RegisterComponent[] => {
	return [
		{
			type: INSERT_BLOCK_SECTION.type,
			key: INSERT_BLOCK_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[INSERT_BLOCK_SECTION.key],
				},
			],
		},
		...(toolbarShowPlusInsertOnly
			? []
			: [
					{
						type: TASK_LIST_GROUP.type,
						key: TASK_LIST_GROUP.key,
						parents: [
							{
								type: INSERT_BLOCK_SECTION.type,
								key: INSERT_BLOCK_SECTION.key,
								rank: INSERT_BLOCK_SECTION_RANK[TASK_LIST_GROUP.key],
							},
						],
					},
					{
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
					},
					{
						type: MEDIA_GROUP.type,
						key: MEDIA_GROUP.key,
						parents: [
							{
								type: INSERT_BLOCK_SECTION.type,
								key: INSERT_BLOCK_SECTION.key,
								rank: INSERT_BLOCK_SECTION_RANK[MEDIA_GROUP.key],
							},
						],
					},
					{
						type: MEDIA_BUTTON.type,
						key: MEDIA_BUTTON.key,
						parents: [
							{
								type: MEDIA_GROUP.type,
								key: MEDIA_GROUP.key,
								rank: MEDIA_GROUP_RANK[MEDIA_BUTTON.key],
							},
						],
						component: () =>
							!!api?.imageUpload ? <ImageButton api={api} /> : <MediaButton api={api} />,
					},
					{
						type: MENTION_GROUP.type,
						key: MENTION_GROUP.key,
						parents: [
							{
								type: INSERT_BLOCK_SECTION.type,
								key: INSERT_BLOCK_SECTION.key,
								rank: INSERT_BLOCK_SECTION_RANK[MENTION_GROUP.key],
							},
						],
					},
					{
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
					},
					{
						type: EMOJI_GROUP.type,
						key: EMOJI_GROUP.key,
						parents: [
							{
								type: INSERT_BLOCK_SECTION.type,
								key: INSERT_BLOCK_SECTION.key,
								rank: INSERT_BLOCK_SECTION_RANK[EMOJI_GROUP.key],
							},
						],
					},
					{
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
					},
					{
						type: LAYOUT_GROUP.type,
						key: LAYOUT_GROUP.key,
						parents: [
							{
								type: INSERT_BLOCK_SECTION.type,
								key: INSERT_BLOCK_SECTION.key,
								rank: INSERT_BLOCK_SECTION_RANK[LAYOUT_GROUP.key],
							},
						],
					},
					{
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
					},
					{
						type: TABLE_GROUP.type,
						key: TABLE_GROUP.key,
						parents: [
							{
								type: INSERT_BLOCK_SECTION.type,
								key: INSERT_BLOCK_SECTION.key,
								rank: INSERT_BLOCK_SECTION_RANK[TABLE_GROUP.key],
							},
						],
					},
					{
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
					},
					{
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
							<TableSizePicker api={api} tableSelectorSupported={tableSelectorSupported} />
						),
					},
				]),
	];
};
