import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { ManifestEditorToolbarActions } from '@atlaskit/native-embeds-common';

/**
 * Handlers for native embed floating toolbar actions.
 * Consumers can provide these to hook into toolbar button clicks.
 */
export interface EditorPluginNativeEmbedsToolbarHandlers {
	onAlignmentClick?: () => void;
	onChangeBorderClick?: () => void;
	onEmbedClick?: () => void;
	onMoreOptionsClick?: () => void;
	onOpenInNewWindowClick?: () => void;
	onRefreshClick?: () => void;
}

/**
 * Handlers for manifest-defined toolbar actions.
 * The key corresponds to the action's `handlerKey` defined in the manifest.
 */
export type EditorPluginNativeEmbedsActionHandlers = Record<string, () => void>;

/**
 * Configuration for the native embeds editor plugin.
 */
export interface EditorPluginNativeEmbedsPluginConfig {
	/**
	 * Handlers for manifest-defined actions, keyed by the action's `handlerKey`.
	 * When a manifest action with `handlerKey: 'refresh'` is clicked,
	 * `actionHandlers['refresh']?.()` is invoked.
	 */
	actionHandlers?: EditorPluginNativeEmbedsActionHandlers;

	/**
	 * Resolves the editor toolbar actions for a given native embed URL.
	 * Called by the floating toolbar to get manifest-defined actions.
	 */
	getEditorToolbarActions?: (url: string) => ManifestEditorToolbarActions | undefined;

	/**
	 * Legacy handlers for backward compatibility.
	 */
	handlers?: EditorPluginNativeEmbedsToolbarHandlers;
}

export type EditorPluginNativeEmbedsPlugin = NextEditorPlugin<
	'editorPluginNativeEmbeds',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>, DecorationsPlugin, ExtensionPlugin];
		pluginConfiguration: EditorPluginNativeEmbedsPluginConfig | undefined;
	}
>;
