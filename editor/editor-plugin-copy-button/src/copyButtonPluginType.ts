import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { MarkType } from '@atlaskit/editor-prosemirror/model';

import { processCopyButtonItems } from './ui/toolbar';

const editorAnalyticsApi: EditorAnalyticsAPI | undefined = undefined;
const processCopyButtonItemsWithAnalytics = processCopyButtonItems(editorAnalyticsApi);

export type CopyButtonPlugin = NextEditorPlugin<
	'copyButton',
	{
		actions: {
			afterCopy: (message: string) => void;
			processCopyButtonItems: typeof processCopyButtonItemsWithAnalytics;
		};
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<AccessibilityUtilsPlugin>];
	}
>;

export type CopyButtonPluginState = {
	copied: boolean;
	markSelection?: { end: number; markType: MarkType; start: number };
};
