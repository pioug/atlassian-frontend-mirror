import React from 'react';

import {
	UNDO_BUTTON,
	REDO_BUTTON,
	UNDO_CHANGES_GROUP_RANK,
	UNDO_CHANGES_GROUP,
	REDO_CHANGES_GROUP_RANK,
	REDO_CHANGES_GROUP,
	TRACK_CHANGES_GROUP_RANK,
	TRACK_CHANGES_GROUP,
	TRACK_CHANGES_SECTION_RANK_NEW,
	TRACK_CHANGES_SECTION,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { UndoRedoPlugin } from '../../undoRedoPluginType';

import { RedoButton } from './RedoButton';
import { UndoButton } from './UndoButton';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<UndoRedoPlugin>,
): RegisterComponent[] => {
	return expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true)
		? [
				{
					type: UNDO_CHANGES_GROUP.type,
					key: UNDO_CHANGES_GROUP.key,
					parents: [
						{
							type: TRACK_CHANGES_SECTION.type,
							key: TRACK_CHANGES_SECTION.key,
							rank: TRACK_CHANGES_SECTION_RANK_NEW[UNDO_CHANGES_GROUP.key],
						},
					],
				},
				{
					type: UNDO_BUTTON.type,
					key: UNDO_BUTTON.key,
					parents: [
						{
							type: UNDO_CHANGES_GROUP.type,
							key: UNDO_CHANGES_GROUP.key,
							rank: UNDO_CHANGES_GROUP_RANK[UNDO_BUTTON.key],
						},
					],
					component: () => <UndoButton api={api} />,
				},
				{
					type: REDO_CHANGES_GROUP.type,
					key: REDO_CHANGES_GROUP.key,
					parents: [
						{
							type: TRACK_CHANGES_SECTION.type,
							key: TRACK_CHANGES_SECTION.key,
							rank: TRACK_CHANGES_SECTION_RANK_NEW[REDO_CHANGES_GROUP.key],
						},
					],
				},
				{
					type: REDO_BUTTON.type,
					key: REDO_BUTTON.key,
					parents: [
						{
							type: REDO_CHANGES_GROUP.type,
							key: REDO_CHANGES_GROUP.key,
							rank: REDO_CHANGES_GROUP_RANK[REDO_BUTTON.key],
						},
					],
					component: () => <RedoButton api={api} />,
				},
			]
		: [
				{
					type: UNDO_BUTTON.type,
					key: UNDO_BUTTON.key,
					parents: [
						{
							type: TRACK_CHANGES_GROUP.type,
							key: TRACK_CHANGES_GROUP.key,
							rank: TRACK_CHANGES_GROUP_RANK[UNDO_BUTTON.key],
						},
					],
					component: () => <UndoButton api={api} />,
				},
				{
					type: REDO_BUTTON.type,
					key: REDO_BUTTON.key,
					parents: [
						{
							type: TRACK_CHANGES_GROUP.type,
							key: TRACK_CHANGES_GROUP.key,
							rank: TRACK_CHANGES_GROUP_RANK[REDO_BUTTON.key],
						},
					],
					component: () => <RedoButton api={api} />,
				},
			];
};
