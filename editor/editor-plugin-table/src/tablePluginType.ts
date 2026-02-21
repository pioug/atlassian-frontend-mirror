import type { AnalyticsEventPayload, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	Command,
	EditorCommand,
	GetEditorFeatureFlags,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AccessibilityUtilsPlugin } from '@atlaskit/editor-plugin-accessibility-utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BatchAttributeUpdatesPlugin } from '@atlaskit/editor-plugin-batch-attribute-updates';
import type { ContentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type { PluginConfig, TableSharedState } from './types';

export interface TablePluginOptions {
	allowContextualMenu?: boolean;
	/**
	 * Enables the fixed column width option.
	 * When enabled, users can choose to apply fixed widths to table columns and these widths won't scale with viewport changes.
	 * Note: This feature requires ADF schema changes to be supported.
	 */
	allowFixedColumnWidthOption?: boolean;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-49683 Internal documentation for deprecation (no external access)}
	 * Deprecating this prop to enable drag and drop in tables by default.
	 * See {@link https://hello.atlassian.net/wiki/spaces/EDITOR/pages/6312469305/Deprecating+legacy+table+controls} for rollout plan
	 **/
	dragAndDropEnabled?: boolean;
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
