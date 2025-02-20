import type { HyperlinkState } from '@atlaskit/editor-common/link';
import type {
	EditorCommand,
	HyperlinkPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CardPlugin } from '@atlaskit/editor-plugin-card';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type {
	HideLinkToolbar,
	InsertLink,
	ShowLinkToolbar,
	UpdateLink,
} from './editor-commands/commands';

type HyperlinkPluginCommands = {
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
};

export type HyperlinkPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<CardPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
];

export type HyperlinkPluginActions = {
	hideLinkToolbar: HideLinkToolbar;
	insertLink: InsertLink;
	updateLink: UpdateLink;
};

export type HyperlinkPluginSharedState = HyperlinkState | undefined;

export type HyperlinkPlugin = NextEditorPlugin<
	'hyperlink',
	{
		pluginConfiguration: HyperlinkPluginOptions | undefined;
		dependencies: HyperlinkPluginDependencies;
		actions: HyperlinkPluginActions;
		commands: HyperlinkPluginCommands;
		sharedState: HyperlinkPluginSharedState;
	}
>;
