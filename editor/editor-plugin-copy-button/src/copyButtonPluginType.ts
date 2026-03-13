import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
	Command,
	FloatingToolbarItem,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
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
