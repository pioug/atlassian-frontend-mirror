import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { UserPreferencesProvider } from '@atlaskit/editor-common/types/user-preferences';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls/blockControlsPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

import type { ToolbarDocking } from './types';

export type SelectionToolbarPluginOptions = {
	/**
	 * Whether to enable floating toolbar for text selection.
	 *
	 * Warning: This option will be deprecated in the future, and instead will rely on options passed to `toolbarPlugin` which
	 * allows more control over toolbar placement.
	 */
	contextualFormattingEnabled?: boolean;
	/**
	 * When true, hides the pin/unpin option from the toolbar menu.
	 * Use this in contexts where toolbar docking should be permanently fixed
	 * @defaults false
	 */
	disablePin?: boolean;
	/** @defaults false */
	preferenceToolbarAboveSelection?: boolean;
	userPreferencesProvider?: UserPreferencesProvider;
};

export type SelectionToolbarPlugin = NextEditorPlugin<
	'selectionToolbar',
	{
		actions?: {
			/**
			 * Clears the toolbar docking override and reverts to the current preference/state value.
			 */
			clearToolbarDockingOverride?: () => boolean;
			forceToolbarDockingWithoutAnalytics?: (toolbarDocking: ToolbarDocking) => boolean;
			/**
			 * Temporarily overrides the toolbar docking position without persisting to user preferences.
			 */
			overrideToolbarDocking?: (toolbarDocking: ToolbarDocking) => boolean;
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
