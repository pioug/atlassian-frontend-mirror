import type { PluginToolbarComponentConfig } from '@atlaskit/editor-common/toolbar/types';
import type { EditorAppearance } from '@atlaskit/editor-common/types/editor-appearance';
import type { OptionalPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type/blockTypePluginType';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block/codeBlockPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel/contextPanelPluginType';
import type { DatePlugin } from '@atlaskit/editor-plugin-date/datePluginType';
import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji/emojiPluginType';
import type { ExpandPlugin } from '@atlaskit/editor-plugin-expand/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension/extensionPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink/hyperlinkPluginType';
import type { ImageUploadPlugin } from '@atlaskit/editor-plugin-image-upload/imageUploadPluginType';
import type { LayoutPlugin } from '@atlaskit/editor-plugin-layout/layout-plugin-type';
import type { MediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert/media-insert-plugin-type';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media/media-plugin-type';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions/mentions-plugin-type';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics/metrics-plugin-type';
import type { PanelPlugin } from '@atlaskit/editor-plugin-panel/panel-plugin-type';
import type { PlaceholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text/placeholder-text-plugin-type';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert/quick-insert-plugin-type';
import type { RulePlugin } from '@atlaskit/editor-plugin-rule/rule-plugin-type';
import type { StatusPlugin } from '@atlaskit/editor-plugin-status/status-plugin-type';
import type { TablePlugin } from '@atlaskit/editor-plugin-table/table-plugin-type';
import type { TasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions/tasks-and-decisions-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';

export type InsertBlockPluginDependencies = [
	TypeAheadPlugin,
	OptionalPlugin<TablePlugin>,
	OptionalPlugin<HyperlinkPlugin>,
	OptionalPlugin<DatePlugin>,
	OptionalPlugin<BlockTypePlugin>,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<ImageUploadPlugin>,
	OptionalPlugin<EmojiPlugin>,
	OptionalPlugin<QuickInsertPlugin>,
	OptionalPlugin<RulePlugin>,
	OptionalPlugin<CodeBlockPlugin>,
	OptionalPlugin<PanelPlugin>,
	OptionalPlugin<MediaPlugin>,
	OptionalPlugin<MediaInsertPlugin>,
	OptionalPlugin<MentionsPlugin>,
	OptionalPlugin<MetricsPlugin>,
	OptionalPlugin<StatusPlugin>,
	OptionalPlugin<LayoutPlugin>,
	OptionalPlugin<ExpandPlugin>,
	OptionalPlugin<PlaceholderTextPlugin>,
	OptionalPlugin<ExtensionPlugin>,
	OptionalPlugin<TasksAndDecisionsPlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<ContextPanelPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
];

type PluginToolbarComponentsConfig<T extends string> = {
	[componentName in T]?: PluginToolbarComponentConfig;
};

export type ToolbarInsertBlockButtonsConfig = PluginToolbarComponentsConfig<
	'codeBlock' | 'emoji' | 'insert' | 'layout' | 'media' | 'mention' | 'table' | 'taskList'
>;

export interface InsertBlockPluginOptions {
	allowExpand?: boolean;
	allowTables?: boolean;
	appearance?: EditorAppearance;
	horizontalRuleEnabled?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	insertMenuItems?: any;
	/**
	 * EDITOR-6558: Optional predicate for filtering insert-block items by
	 * `value.name` before they're rendered in the toolbar / dropdown /
	 * element browser. Items returning `false` are hidden.
	 *
	 * Used by Markdown Mode (gated by the `cc-markdown-mode` experiment in
	 * Confluence) to allowlist only items whose corresponding node/mark
	 * types have a clean GFM round-trip. Currently applied to the main
	 * toolbar insert surfaces (`ToolbarInsertBlock`, `useInsertButtonState`).
	 */
	itemFilter?: (item: { value: { name: string } }) => boolean;
	nativeStatusSupported?: boolean;
	/**
	 * To hide the element browser "view more" button in the
	 * overflow dropdown menu
	 * @default undefined Does not show the view more by default
	 */
	showElementBrowserLink?: boolean;
	tableSelectorSupported?: boolean;
	/**
	 * Configure which toolbar buttons should be visible
	 * @default undefined - shows all available buttons (current behaviour)
	 *
	 * Only respected when the editor configuration includes `toolbarPlugin` from
	 * `@atlaskit/editor-plugin-toolbar`.
	 */
	toolbarButtons?: ToolbarInsertBlockButtonsConfig;
	/**
	 * To hide the individual insert block buttons in the toolbar
	 * and only show the plus button
	 * @default undefined Shows the insert block buttons and the plus button
	 *
	 * Only respected when the editor configuration includes `toolbarPlugin` from
	 * `@atlaskit/editor-plugin-toolbar`.
	 *
	 * @warning Use {@link toolbarButtons} instead to configure the insert block toolbar buttons
	 * @see https://product-fabric.atlassian.net/browse/ED-29426
	 */
	toolbarShowPlusInsertOnly?: boolean;
}

/**
 * @private
 * @deprecated Use {@link InsertBlockPluginOptions} instead
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type InsertBlockOptions = InsertBlockPluginOptions;

export interface InsertBlockPluginState {
	showElementBrowser: boolean;
}
