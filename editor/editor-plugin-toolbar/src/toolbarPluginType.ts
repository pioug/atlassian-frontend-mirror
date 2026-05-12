import type { ContextualFormattingEnabledOptions } from '@atlaskit/editor-common/toolbar';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { BreakpointPreset } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { RegisterComponentsAction, ToolbarPluginOptions } from './types';

export type EditorToolbarPluginState = {
	/**
	 * Runtime override for the contextual-formatting mode. When set, callers
	 * should treat it as taking precedence over `contextualFormattingMode()`.
	 * Lives in PM state so React subscribers re-render on flip. Updated via
	 * the `setContextualFormattingModeOverride` command; consumers must read
	 * it via `useSharedPluginStateWithSelector(api, ['toolbar'], ...)` and
	 * merge it themselves — see SelectionToolbar / Section / FullPageToolbarNext
	 * for the merge pattern. Used by Markdown Mode to pin the primary toolbar
	 * while source / preview view is active (no PM selection to anchor a
	 * floating toolbar to).
	 */
	contextualFormattingModeOverride?: ContextualFormattingEnabledOptions;
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
			 * - `controlled`: Both inline and primary toolbars are available - this option requires editor-plugin-selection-toolbar to be configured with
			 * userPreferencesProvider to control the toolbar pinning.
			 */
			contextualFormattingMode: () => ContextualFormattingEnabledOptions;
			/**
			 * Returns the breakpoint preset configuration for the toolbar.
			 *
			 * This method retrieves the breakpoint preset that determines how the toolbar
			 * responds to different viewport sizes and layouts.
			 *
			 * @returns The configured breakpoint preset, or `undefined` if not set.
			 */
			getBreakpointPreset: () => BreakpointPreset | undefined;
			getComponents: () => Array<RegisterComponent>;
			registerComponents: RegisterComponentsAction;
		};
		commands: {
			/**
			 * Sets (or clears) the runtime override for `contextualFormattingMode`.
			 * Pass `undefined` to clear and fall back to config / user preference.
			 * Used by Markdown Mode to pin the toolbar while the source / preview
			 * view is active. Exposed as a command (not an action) so callers can
			 * compose the meta onto an existing transaction and dispatch once.
			 */
			setContextualFormattingModeOverride: (
				mode: ContextualFormattingEnabledOptions | undefined,
			) => EditorCommand;
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
