import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PastePlugin } from '@atlaskit/editor-plugin-paste';

import type { ToolbarDropdownOption } from './types/types';

export type PasteOptionsToolbarPluginDependencies = [OptionalPlugin<AnalyticsPlugin>, PastePlugin];

export interface PasteOptionsToolbarSharedState {
	isPlainText: boolean;
	plaintextLength: number;
	selectedOption: ToolbarDropdownOption;
	showToolbar: boolean;
}

export type PasteOptionsToolbarPlugin = NextEditorPlugin<
	'pasteOptionsToolbarPlugin',
	{
		dependencies: PasteOptionsToolbarPluginDependencies;
	}
>;
