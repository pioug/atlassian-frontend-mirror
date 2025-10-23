import type {
	NextEditorPlugin,
	OptionalPlugin,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';

import type { ToolbarDocking } from './types';

export type SelectionToolbarPluginOptions = {
	/**
	 * Whether to enable floating toolbar for text selection.
	 *
	 * Warning: This option will be deprecated in the future, and instead will rely on options passed to `toolbarPlugin` which
	 * allows more control over toolbar placement.
	 */
	contextualFormattingEnabled?: boolean;
	/** @defaults false */
	preferenceToolbarAboveSelection?: boolean;
	userPreferencesProvider?: UserPreferencesProvider;
};

export type SelectionToolbarPlugin = NextEditorPlugin<
	'selectionToolbar',
	{
		actions?: {
			forceToolbarDockingWithoutAnalytics?: (toolbarDocking: ToolbarDocking) => boolean;
			/**
			 * @private
			 * @deprecated not in use
			 */
			refreshToolbarDocking?: () => boolean;
			/**
			 * @private
			 * @deprecated use userPreference API to set toolbar docking instead
			 */
			setToolbarDocking?: (toolbarDocking: ToolbarDocking) => boolean;
			suppressToolbar?: () => boolean;
			unsuppressToolbar?: () => boolean;
		};
		dependencies: [
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<BlockControlsPlugin>,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<UserIntentPlugin>,
		];
		pluginConfiguration: SelectionToolbarPluginOptions;
		sharedState: {
			toolbarDocking: ToolbarDocking;
		};
	}
>;
