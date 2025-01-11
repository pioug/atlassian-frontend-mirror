import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';

export type MediaInsertPluginState = {
	isOpen?: boolean;
	mountInfo?: { ref: HTMLElement; mountPoint: HTMLElement };
};

export type MediaInsertPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	MediaPlugin,
	OptionalPlugin<FeatureFlagsPlugin>,
];

export type MediaInsertPluginCommands = {
	showMediaInsertPopup: (mountInfo?: {
		ref: HTMLElement;
		mountPoint: HTMLElement;
	}) => EditorCommand;
};

export type MediaInsertPlugin = NextEditorPlugin<
	'mediaInsert',
	{
		dependencies: MediaInsertPluginDependencies;
		sharedState: MediaInsertPluginState;
		commands: MediaInsertPluginCommands;
	}
>;
