import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics/types/events';
import type { _MarkdownModePluginStub } from '@atlaskit/editor-common/types';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { GetEditorFeatureFlags } from '@atlaskit/editor-common/types/feature-flags';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils/accessibilityUtilsPluginType';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BatchAttributeUpdatesPlugin } from '@atlaskit/editor-plugin-batch-attribute-updates/batchAttributeUpdatesPluginType';
import type { ContentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion/contentInsertionPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension/extensionPluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline/guidelinePluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode/limited-mode-plugin-type';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width/width-plugin-type';

import type { PluginConfig, TableSharedState } from './types';

export interface TablePluginOptions {
	__livePage?: boolean;
	allowContextualMenu?: boolean;
	/**
	 * Enables the fixed column width option.
	 * When enabled, users can choose to apply fixed widths to table columns and these widths won't scale with viewport changes.
	 * Note: This feature requires ADF schema changes to be supported.
	 */
	allowFixedColumnWidthOption?: boolean;
	// TODO: ED-26961 - these two need to be rethought
	fullWidthEnabled?: boolean;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-49683 Internal documentation for deprecation (no external access)}
	 * Deprecating this prop to enable table scaling by default
	 * See {@link https://hello.atlassian.net/wiki/spaces/EDITOR/pages/6312469305/Deprecating+legacy+table+controls} for rollout plan
	 **/
	isTableScalingEnabled?: boolean;
	maxWidthEnabled?: boolean;
	tableOptions: PluginConfig;
	wasFullWidthEnabled?: boolean;
	wasMaxWidthEnabled?: boolean;
}

type InsertTableAction = (analyticsPayload: AnalyticsEventPayload) => Command;

// TODO: ED-26961 - duplicating type instead of importing media plugin causing a circular dependency
type MediaPlugin = NextEditorPlugin<
	'media',
	{
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		actions: any;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		commands: any;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		dependencies: any;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pluginConfiguration: any;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		sharedState: any;
	}
>;

export type TablePluginActions = {
	insertTable: InsertTableAction;
};

export type TablePluginCommands = {
	insertTableWithSize: (
		rowsCount: number,
		colsCount: number,
		inputMethod?: INPUT_METHOD.PICKER,
	) => EditorCommand;
};

export type TablePluginDependencies = [
	AnalyticsPlugin,
	ContentInsertionPlugin,
	WidthPlugin,
	SelectionPlugin,
	OptionalPlugin<LimitedModePlugin>,
	OptionalPlugin<GuidelinePlugin>,
	OptionalPlugin<BatchAttributeUpdatesPlugin>,
	OptionalPlugin<AccessibilityUtilsPlugin>,
	OptionalPlugin<MediaPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<ExtensionPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<UserIntentPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
	OptionalPlugin<_MarkdownModePluginStub>,
];

export type TablePlugin = NextEditorPlugin<
	'table',
	{
		actions: TablePluginActions;
		commands: TablePluginCommands;
		dependencies: TablePluginDependencies;
		pluginConfiguration: TablePluginOptions | undefined;
		sharedState?: TableSharedState;
	}
>;
