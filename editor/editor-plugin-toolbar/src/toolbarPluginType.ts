import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { RegisterComponentsAction, ToolbarPluginOptions } from './types';

export type EditorToolbarPluginState = {
	selectedNode?: {
		marks: string[];
		node: PMNode;
		nodeType: string;
		pos: number;
	};
	shouldShowToolbar: boolean;
};

export type ToolbarPlugin = NextEditorPlugin<
	'toolbar',
	{
		actions: {
			/**
			 * Returns the current contextual formatting toolbar mode configuration.
			 *
			 * This method retrieves the active setting that determines the behavior and placement
			 * of the contextual formatting toolbar in the editor.
			 *
			 * @returns The active contextual formatting mode:
			 * - `always-inline`: Formatting controls appear in a floating toolbar near selected text
			 * - `always-pinned`: Formatting controls are pinned to the top toolbar (default)
			 * - `controlled`: Both inline and primary toolbars are available
			 */
			contextualFormattingMode: () => ContextualFormattingEnabledOptions;
			getComponents: () => Array<RegisterComponent>;
			registerComponents: RegisterComponentsAction;
		};
		dependencies: [
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
		];
		pluginConfiguration?: ToolbarPluginOptions;
		sharedState: EditorToolbarPluginState;
	}
>;
