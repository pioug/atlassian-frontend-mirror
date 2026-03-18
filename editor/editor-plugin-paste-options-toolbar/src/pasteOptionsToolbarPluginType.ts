import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PastePlugin } from '@atlaskit/editor-plugin-paste';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry';

import type { ToolbarDropdownOption } from './types/types';

export type PasteOptionsToolbarPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	PastePlugin,
	OptionalPlugin<UiControlRegistryPlugin>,
];

export interface PasteOptionsToolbarSharedState {
	isPlainText: boolean;
	pasteAncestorNodeNames: string[];
	pasteEndPos: number;
	pasteStartPos: number;
	plaintextLength: number;
	selectedOption: ToolbarDropdownOption;
	showLegacyOptions: boolean;
	showToolbar: boolean;
}

export type PasteOptionsToolbarPlugin = NextEditorPlugin<
	'pasteOptionsToolbarPlugin',
	{
		dependencies: PasteOptionsToolbarPluginDependencies;
		pluginConfiguration?: {
			usePopupBasedPasteActionsMenu?: boolean;
		};
		sharedState: PasteOptionsToolbarSharedState;
	}
>;
