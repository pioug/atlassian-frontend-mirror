import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { MarkType } from '@atlaskit/editor-prosemirror/model';

import { processCopyButtonItems } from './ui/toolbar';

const editorAnalyticsApi: EditorAnalyticsAPI | undefined = undefined;
const processCopyButtonItemsWithAnalytics = processCopyButtonItems(editorAnalyticsApi);

export type CopyButtonPlugin = NextEditorPlugin<
	'copyButton',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		actions: {
			processCopyButtonItems: typeof processCopyButtonItemsWithAnalytics;
		};
	}
>;

export type CopyButtonPluginState = {
	copied: boolean;
	markSelection?: { start: number; end: number; markType: MarkType };
};
