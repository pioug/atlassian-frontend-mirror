import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';

import type { DatePluginConfig, DatePluginSharedState, DeleteDate, InsertDate } from './types';

export type DatePlugin = NextEditorPlugin<
	'date',
	{
		pluginConfiguration: DatePluginConfig | undefined;
		dependencies: [typeof analyticsPlugin, EditorDisabledPlugin];
		sharedState: DatePluginSharedState;
		commands: {
			insertDate: InsertDate;
			deleteDate: DeleteDate;
		};
	}
>;
