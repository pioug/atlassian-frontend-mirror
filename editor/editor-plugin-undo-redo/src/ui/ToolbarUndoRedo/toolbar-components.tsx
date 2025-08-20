import React from 'react';

import {
	UNDO_BUTTON,
	REDO_BUTTON,
	TRACK_CHANGES_GROUP_RANK,
	TRACK_CHANGES_GROUP,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { UndoRedoPlugin } from '../../undoRedoPluginType';

import { RedoButton } from './RedoButton';
import { UndoButton } from './UndoButton';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<UndoRedoPlugin>,
): RegisterComponent[] => {
	return [
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
