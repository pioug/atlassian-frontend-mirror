import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { FloatingToolbarItem } from '@atlaskit/editor-common/types/floating-toolbar';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils/accessibilityUtilsPluginType';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations/main';
import type { MarkType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { processCopyButtonItems } from './ui/toolbar';

const editorAnalyticsApi: EditorAnalyticsAPI | undefined = undefined;
const processCopyButtonItemsWithAnalytics: (
	state: EditorState,
) => (
	items: Array<FloatingToolbarItem<Command>>,
	hoverDecoration: HoverDecorationHandler | undefined,
) => Array<FloatingToolbarItem<Command>> = processCopyButtonItems(editorAnalyticsApi);

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
