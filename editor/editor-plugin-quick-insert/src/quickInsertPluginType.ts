import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory/quick-insert-provider';
import type { IsRecommendedItem } from '@atlaskit/editor-common/quick-insert/is-recommended-item';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type {
	QuickInsertPluginOptions as CommonQuickInsertPluginOptions,
	QuickInsertSharedState as CommonQuickInsertSharedState,
	QuickInsertHandler,
	QuickInsertSearchOptions,
} from '@atlaskit/editor-common/types/quick-insert';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types/type-ahead';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics/metrics-plugin-type';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin-type';
import type { TypeAheadInputMethod } from '@atlaskit/editor-plugin-type-ahead/types';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';

export type QuickInsertSharedState = CommonQuickInsertSharedState & {
	typeAheadHandler: TypeAheadHandler;
};

export type QuickInsertPluginOptions = CommonQuickInsertPluginOptions & {
	/**
	 * Enables the floating quick insert button, which appears inline alongside content in the editor.
	 *
	 * Warning: This option replaces the current block control plugin config `blockControls.quickInsertButtonEnabled`
	 * and is only available when `platform_editor_block_control_migration` experiment is enabled.
	 */
	blockControlButtonEnabled?: boolean;
	/**
	 * Selects and ranks the items shown in the Recommended section of the `/` menu.
	 * Items that are not registered or are hidden are skipped, so lower-ranked items act as fallbacks.
	 * Defaults to `defaultIsRecommendedItem`.
	 *
	 * Only applies when the `platform_editor_slash_command` experiment is enabled.
	 */
	isRecommendedItem?: IsRecommendedItem;
	/**
	 * Maximum number of items shown in the Recommended section, between 1 and 5. Defaults to 5.
	 *
	 * Only applies when the `platform_editor_slash_command` experiment is enabled.
	 */
	maxRecommendedItems?: number;
};

export type OpenElementBrowserOptions = {
	category?: string;
};

export type QuickInsertPlugin = NextEditorPlugin<
	'quickInsert',
	{
		actions: {
			getSuggestions: (searchOptions: QuickInsertSearchOptions) => QuickInsertItem[];
			insertItem: (
				item: QuickInsertItem,
				source?: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR | INPUT_METHOD.ELEMENT_BROWSER,
			) => Command;
			openTypeAhead: (
				inputMethod: TypeAheadInputMethod,
				removePrefixTriggerOnCancel?: boolean,
			) => boolean;
		};
		commands: {
			addQuickInsertItem: (item: QuickInsertHandler) => EditorCommand;
			openElementBrowser: (options?: OpenElementBrowserOptions) => EditorCommand;
			/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-62138 Internal documentation for deprecation (no external access)} Tracked by EDITOR-8422. Use `openElementBrowser` instead. */
			openElementBrowserModal: EditorCommand;
			removeQuickInsertItem: (key: string) => EditorCommand;
			updateQuickInsertItem: (key: string, item: QuickInsertHandler) => EditorCommand;
		};
		dependencies: [
			TypeAheadPlugin,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<MetricsPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<UiControlRegistryPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
		pluginConfiguration: QuickInsertPluginOptions | undefined;
		sharedState: QuickInsertSharedState | null;
	}
>;
