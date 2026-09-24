import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	QuickInsertPluginOptions as CommonQuickInsertPluginOptions,
	QuickInsertSharedState as CommonQuickInsertSharedState,
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	QuickInsertHandler,
	QuickInsertSearchOptions,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { MetricsPlugin } from '@atlaskit/editor-plugin-metrics';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
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
