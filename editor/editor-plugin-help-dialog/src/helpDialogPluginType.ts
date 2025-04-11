import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';

export interface HelpDialogSharedState {
	isVisible: boolean;
	imageEnabled: boolean;
}

export type HelpDialogDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<QuickInsertPlugin>,
];

export type HelpDialogPluginOptions = boolean;

export type HelpDialogPlugin = NextEditorPlugin<
	'helpDialog',
	{
		dependencies: HelpDialogDependencies;
		pluginConfiguration: HelpDialogPluginOptions;
		sharedState: HelpDialogSharedState | null;
		actions: {
			openHelp(): void;
			closeHelp(): void;
		};
	}
>;
