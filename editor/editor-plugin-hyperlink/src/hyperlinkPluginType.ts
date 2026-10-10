import type { HyperlinkState } from '@atlaskit/editor-common/link/types';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { HyperlinkPluginOptions as CommonHyperlinkPluginOptions } from '@atlaskit/editor-common/types/hyperlink';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { CardPlugin } from '@atlaskit/editor-plugin-card/cardPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

import type {
	HideLinkToolbar,
	InsertLink,
	ShowLinkToolbar,
	UpdateLink,
} from './editor-commands/commands';

type HyperlinkPluginCommands = {
	/**
	 * EditorCommand to remove the current active link.
	 *
	 * Example:
	 *
	 * ```
	 * api.core.actions.execute(
	 *   api.hyperlink.commands.removeLink()
	 * )
	 * ```
	 */
	removeLink: () => EditorCommand;

	/**
	 * EditorCommand to show link toolbar.
	 *
	 * Example:
	 *
	 * ```
	 * const newTr = pluginInjectionApi?.hyperlink.commands.showLinkToolbar(
	 *   inputMethod
	 * )({ tr })
	 * ```
	 */
	showLinkToolbar: ShowLinkToolbar;

	/**
	 * EditorCommand to edit the current active link.
	 *
	 * Example:
	 *
	 * ```
	 * api.core.actions.execute(
	 *   api.hyperlink.commands.updateLink(href, text)
	 * )
	 * ```
	 */
	updateLink: (href: string, text: string) => EditorCommand;
};

export type HyperlinkPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<CardPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<ConnectivityPlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<SelectionToolbarPlugin>,
	OptionalPlugin<UserPreferencesPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UserIntentPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
];

export type HyperlinkPluginActions = {
	hideLinkToolbar: HideLinkToolbar;
	insertLink: InsertLink;
	updateLink: UpdateLink;
};

export type HyperlinkPluginOptions = CommonHyperlinkPluginOptions;

export type HyperlinkPluginSharedState = HyperlinkState | undefined;

export type HyperlinkPlugin = NextEditorPlugin<
	'hyperlink',
	{
		actions: HyperlinkPluginActions;
		commands: HyperlinkPluginCommands;
		dependencies: HyperlinkPluginDependencies;
		pluginConfiguration: HyperlinkPluginOptions | undefined;
		sharedState: HyperlinkPluginSharedState;
	}
>;
