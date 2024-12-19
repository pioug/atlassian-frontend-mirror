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
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type { PluginConfig, TableSharedState } from './types';

export interface TablePluginOptions {
	tableOptions: PluginConfig;
	// this option will eventually be removed, and enabled by default
	dragAndDropEnabled?: boolean;
	// this option will eventually be removed, and enabled by default
	isTableScalingEnabled?: boolean;
	allowContextualMenu?: boolean;
	// TODO these two need to be rethought
	fullWidthEnabled?: boolean;
	wasFullWidthEnabled?: boolean;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
	isNewColumnResizingEnabled?: boolean;
	isCommentEditor?: boolean;
	isChromelessEditor?: boolean;
}

type InsertTableAction = (analyticsPayload: AnalyticsEventPayload) => Command;

// TODO: duplicating type instead of importing media plugin causing a circular dependency
type MediaPlugin = NextEditorPlugin<
	'media',
	{
		pluginConfiguration: any;
		dependencies: any;
		sharedState: any;
		actions: any;
		commands: any;
	}
>;

export type TablePlugin = NextEditorPlugin<
	'table',
	{
		pluginConfiguration: TablePluginOptions | undefined;
		actions: {
			insertTable: InsertTableAction;
		};
		sharedState?: TableSharedState;
		commands: {
			insertTableWithSize: (
				rowsCount: number,
				colsCount: number,
				inputMethod?: INPUT_METHOD.PICKER,
			) => EditorCommand;
		};
		dependencies: [
			AnalyticsPlugin,
			ContentInsertionPlugin,
			WidthPlugin,
			SelectionPlugin,
			OptionalPlugin<GuidelinePlugin>,
			OptionalPlugin<BatchAttributeUpdatesPlugin>,
			OptionalPlugin<AccessibilityUtilsPlugin>,
			OptionalPlugin<MediaPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
			OptionalPlugin<FeatureFlagsPlugin>,
		];
	}
>;
