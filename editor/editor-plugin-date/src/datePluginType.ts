import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';

import type { DatePluginOptions, DatePluginSharedState, DeleteDate, InsertDate } from './types';

export type DatePluginDependencies = [
	typeof analyticsPlugin,
	EditorDisabledPlugin,
	OptionalPlugin<AnnotationPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
];

export type DatePlugin = NextEditorPlugin<
	'date',
	{
		pluginConfiguration: DatePluginOptions | undefined;
		dependencies: DatePluginDependencies;
		sharedState: DatePluginSharedState;
		commands: {
			insertDate: InsertDate;
			deleteDate: DeleteDate;
		};
	}
>;
