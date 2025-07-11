import type { EditorAppearance, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { ContextPanelPlugin } from '@atlaskit/editor-plugin-context-panel';
import type { DatePlugin } from '@atlaskit/editor-plugin-date';
import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import type { ExpandPlugin } from '@atlaskit/editor-plugin-expand';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { ImageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';
import type { LayoutPlugin } from '@atlaskit/editor-plugin-layout';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';
import type { MediaInsertPlugin } from '@atlaskit/editor-plugin-media-insert';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics';
import type { PanelPlugin } from '@atlaskit/editor-plugin-panel';
import type { PlaceholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { RulePlugin } from '@atlaskit/editor-plugin-rule';
import type { StatusPlugin } from '@atlaskit/editor-plugin-status';
import type { TablePlugin } from '@atlaskit/editor-plugin-table';
import type { TasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';

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
];

export interface InsertBlockPluginOptions {
	allowTables?: boolean;
	allowExpand?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	insertMenuItems?: any;
	horizontalRuleEnabled?: boolean;
	nativeStatusSupported?: boolean;
	/**
	 * To hide the element browser "view more" button in the
	 * overflow dropdown menu
	 * @default undefined Does not show the view more by default
	 */
	showElementBrowserLink?: boolean;
	tableSelectorSupported?: boolean;
	appearance?: EditorAppearance;
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
