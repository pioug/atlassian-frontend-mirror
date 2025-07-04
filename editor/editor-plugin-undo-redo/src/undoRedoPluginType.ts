import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

import { type InputSource } from './pm-plugins/enums';

export type UndoRedoAction = (inputSource?: InputSource) => boolean;

export type UndoRedoPlugin = NextEditorPlugin<
	'undoRedoPlugin',
	{
		dependencies: [
			TypeAheadPlugin,
			HistoryPlugin,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
		];
		actions: {
			undo: UndoRedoAction;
			redo: UndoRedoAction;
		};
	}
>;
