import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert/quick-insert-plugin-type';

export interface HelpDialogSharedState {
	aiEnabled: boolean;
	imageEnabled: boolean;
	isVisible: boolean;
}

export type HelpDialogDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<QuickInsertPlugin>,
];

export type HelpDialogPluginOptions =
	| boolean
	| { aiEnabled?: boolean; imageUploadProviderExists?: boolean };

export type HelpDialogPlugin = NextEditorPlugin<
	'helpDialog',
	{
		actions: {
			// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
			closeHelp(): void;
			// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
			openHelp(): void;
		};
		dependencies: HelpDialogDependencies;
		pluginConfiguration: HelpDialogPluginOptions;
		sharedState: HelpDialogSharedState | null;
	}
>;
