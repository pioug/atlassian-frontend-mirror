import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PastePlugin } from '@atlaskit/editor-plugin-paste';

export type PasteOptionsToolbarPlugin = NextEditorPlugin<
	'pasteOptionsToolbarPlugin',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>, PastePlugin];
	}
>;
