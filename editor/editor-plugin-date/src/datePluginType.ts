import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';

import type { DatePluginConfig, DatePluginSharedState, DeleteDate, InsertDate } from './types';

export type DatePlugin = NextEditorPlugin<
	'date',
	{
		pluginConfiguration: DatePluginConfig | undefined;
		dependencies: [
			typeof analyticsPlugin,
			EditorDisabledPlugin,
			OptionalPlugin<AnnotationPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
		sharedState: DatePluginSharedState;
		commands: {
			insertDate: InsertDate;
			deleteDate: DeleteDate;
		};
	}
>;
