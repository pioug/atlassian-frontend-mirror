import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';

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

export type EditorPluginNativeEmbedsPlugin = NextEditorPlugin<
	'editorPluginNativeEmbeds',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>, DecorationsPlugin, ExtensionPlugin];
		pluginConfiguration: { handlers?: EditorPluginNativeEmbedsToolbarHandlers } | undefined;
	}
>;
